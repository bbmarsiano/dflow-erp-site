# Contact Form Implementation Audit - DFlow ERP

## A) Frontend Submission Flow

### File Location
**`src/components/sections/ContactSection.tsx`** (lines 25-299)

### Form Fields & Validation

**Fields captured:**
- `name` (text, required) - User's name
- `email` (email, required) - User's email address
- `phone` (tel, optional) - User's phone number
- `company` (text, optional) - User's company name
- `message` (textarea, required) - Message content

**Validation:**
- HTML5 `required` attribute on name, email, message
- Email type validation on email field
- Client-side validation before submission

### CAPTCHA Implementation

**Two modes supported:**
1. **Testing mode** (`captcha_mode: 'testing'`):
   - Uses custom `MathCaptcha` component (`src/components/MathCaptcha.tsx`)
   - Simple math problem (e.g., "What is 5 + 3?")
   - Token: `'testing-mode-bypass'`

2. **Google reCAPTCHA v2** (`captcha_mode: 'google'`):
   - Uses Google reCAPTCHA v2 "I'm not a robot" checkbox
   - Requires `recaptcha_site_key` from `smtp_settings` table
   - Token: Actual reCAPTCHA response token

**Settings source:**
- `captcha_mode` from `site_settings.captcha_mode` (defaults to `'testing'`)
- `recaptcha_site_key` from `smtp_settings.recaptcha_site_key`

### Submission Code

```typescript
// src/components/sections/ContactSection.tsx (lines 76-148)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus('idle');
  setErrorMessage('');

  try {
    let recaptchaToken = '';

    // Validate CAPTCHA
    if (captchaMode === 'testing') {
      if (!isMathCaptchaValid) {
        setSubmitStatus('error');
        setErrorMessage(language === 'bg' ? 'Моля, решете математическата задача' : 'Please solve the math problem');
        setIsSubmitting(false);
        return;
      }
      recaptchaToken = 'testing-mode-bypass';
    } else {
      recaptchaToken = window.grecaptcha.getResponse(recaptchaWidgetId || 0);
      if (!recaptchaToken) {
        setSubmitStatus('error');
        setErrorMessage(language === 'bg' ? 'Моля, потвърдете че не сте робот' : 'Please verify you are not a robot');
        setIsSubmitting(false);
        return;
      }
    }

    // Direct Supabase insert (NOT using Edge Function)
    const { error: insertError } = await supabase
      .from('contact_submissions')
      .insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        message: formData.message,
        recaptcha_token: recaptchaToken,
      }]);

    if (insertError) {
      console.error('Database error:', insertError);
      throw new Error(insertError.message || 'Failed to save contact submission');
    }

    // Success handling
    setSubmitStatus('success');
    setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    
    // Reset CAPTCHA
    if (captchaMode === 'testing') {
      setIsMathCaptchaValid(false);
    } else if (recaptchaWidgetId !== null) {
      window.grecaptcha.reset(recaptchaWidgetId);
    }

    setTimeout(() => setSubmitStatus('idle'), 5000);
  } catch (error) {
    console.error('Error submitting form:', error);
    setSubmitStatus('error');
    setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
  } finally {
    setIsSubmitting(false);
  }
};
```

**Key points:**
- **Direct database insert** - No Edge Function call from frontend
- Uses Supabase client (`supabase.from('contact_submissions').insert()`)
- Database trigger handles email sending (see Backend section)
- Form resets on success
- Error handling with user-friendly messages

---

## B) Backend / Edge Function Flow

### Database Trigger (Primary Method)

**Location:** `supabase/migrations/20251219075719_fix_security_issues.sql` (lines 245-306)

**Trigger function:** `send_contact_email_trigger()`

**How it works:**
1. Trigger fires **AFTER INSERT** on `contact_submissions` table
2. Reads `target_email` from `contact_content` table
3. If `target_email` is NULL/empty, trigger exits (no email sent)
4. Currently uses placeholder URL `'https://api.example.com/send-email'` (NOT ACTIVE)
5. Updates `email_sent = true` on submission record

**Current status:** The trigger exists but uses a placeholder API endpoint. The actual email sending is handled by the Edge Function (see below).

### Edge Function (Alternative/Actual Implementation)

**Location:** `supabase/functions/send-contact-email/index.ts`

**Endpoint:** `{SUPABASE_URL}/functions/v1/send-contact-email`

**Request Payload:**
```typescript
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  recaptchaToken: string;
}
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Message received"
}

// Error (500)
{
  "error": "Failed to process request",
  "details": "Error message"
}
```

**Edge Function Flow:**
1. Receives POST request with contact form data
2. Fetches SMTP settings from `smtp_settings` table
3. Creates SMTP client using `emailjs` library
4. Sends email asynchronously (fire-and-forget)
5. Returns success response immediately (doesn't wait for email)

**SMTP Settings Used:**
- `smtp_host` - SMTP server hostname
- `smtp_port` - SMTP port (465 for SSL, 587 for TLS)
- `smtp_user` - SMTP username/email
- `smtp_password` - SMTP password
- `from_name` - Display name for sender
- `from_email` - Sender email (uses `smtp_user`)

**Email Content:**
- **To:** `smtp_settings.smtp_user` (sends to itself)
- **From:** `{from_name} <{smtp_user}>`
- **Subject:** `New Contact Form - {name}`
- **Body:** HTML and plain text versions with all form fields

**Note:** The Edge Function is NOT called directly from the frontend. It appears to be designed for use by the database trigger, but the current trigger implementation uses a placeholder URL.

**Fallback behavior:**
- If SMTP settings are missing or invalid, email sending fails silently
- Submission is still saved to database
- No error is returned to user (email is sent asynchronously)

---

## C) Database Schema & RLS

### Table Definition

**Migration files:**
1. `supabase/migrations/20251109104515_create_cms_schema.sql` (lines 264-284) - Initial table
2. `supabase/migrations/20251111132526_add_phone_and_email_trigger.sql` - Added phone, email tracking
3. `supabase/migrations/20251111144746_add_viewed_flag_to_submissions.sql` - Added viewed tracking
4. `supabase/migrations/20251111183702_add_update_delete_policies_to_submissions.sql` - Added UPDATE/DELETE policies
5. `supabase/migrations/20251219075719_fix_security_issues.sql` - Security fixes, trigger update

### Complete Table Schema

```sql
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text DEFAULT '',
  interest text DEFAULT '',  -- Note: Not used in current form, kept for backward compatibility
  message text NOT NULL,
  phone text,  -- Added in migration 20251111132526
  recaptcha_token text,  -- Added in migration 20251111132526
  email_sent boolean DEFAULT false,  -- Added in migration 20251111132526
  email_sent_at timestamptz,  -- Added in migration 20251111132526
  email_error text,  -- Added in migration 20251111132526
  viewed boolean DEFAULT false,  -- Added in migration 20251111144746
  viewed_at timestamptz,  -- Added in migration 20251111144746
  viewed_by uuid REFERENCES auth.users(id),  -- Added in migration 20251111144746
  created_at timestamptz DEFAULT now()
);
```

### Column Details

| Column | Type | NOT NULL | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | uuid | ✅ | `gen_random_uuid()` | Primary key |
| `name` | text | ✅ | - | User's name |
| `email` | text | ✅ | - | User's email |
| `company` | text | ❌ | `''` | Optional company name |
| `interest` | text | ❌ | `''` | Legacy field, not used in current form |
| `message` | text | ✅ | - | Message content |
| `phone` | text | ❌ | NULL | Optional phone number |
| `recaptcha_token` | text | ❌ | NULL | CAPTCHA token |
| `email_sent` | boolean | ❌ | `false` | Email delivery status |
| `email_sent_at` | timestamptz | ❌ | NULL | Email sent timestamp |
| `email_error` | text | ❌ | NULL | Email error message if failed |
| `viewed` | boolean | ❌ | `false` | Admin viewed status |
| `viewed_at` | timestamptz | ❌ | NULL | First viewed timestamp |
| `viewed_by` | uuid | ❌ | NULL | Admin user ID who viewed |
| `created_at` | timestamptz | ❌ | `now()` | Submission timestamp |

### Indexes

```sql
-- Index for viewed status queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_viewed_by 
ON contact_submissions(viewed_by);
```

### RLS (Row Level Security)

**RLS Enabled:** ✅ Yes

**Policies:**

1. **INSERT Policy** (Public - Anyone can submit):
```sql
CREATE POLICY "Anyone can insert contact submissions"
  ON contact_submissions FOR INSERT
  TO public
  WITH CHECK (true);
```

2. **SELECT Policy** (Authenticated users only):
```sql
CREATE POLICY "Authenticated users can read contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);
```

3. **UPDATE Policy** (Authenticated users only):
```sql
CREATE POLICY "Authenticated users can update contact submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

4. **DELETE Policy** (Authenticated users only):
```sql
CREATE POLICY "Authenticated users can delete contact submissions"
  ON contact_submissions
  FOR DELETE
  TO authenticated
  USING (true);
```

---

## D) Admin Management UI

### File Location
**`src/components/admin/SubmissionsEditor.tsx`** (lines 1-494)

### Features

**1. List View (Table)**
- Displays all contact submissions in a sortable table
- Columns:
  - Status (viewed/unviewed icon)
  - Name
  - Email
  - Company
  - Date (created_at)
  - Email Status (Sent/Failed/Pending badge)
  - Actions (Delete button)

**2. Filtering**
- **All** - Shows all submissions
- **Unread** - Shows only unviewed submissions (`viewed = false`)
- Unread count badge displayed

**3. Sorting**
- Sortable columns: `viewed`, `name`, `email`, `company`, `created_at`
- Toggle ascending/descending on column click
- Visual indicators (arrows) for sort direction

**4. Details View (Modal)**
- Click any row to open detailed view
- Shows all fields:
  - Name
  - Email (clickable mailto link)
  - Phone (clickable tel link, if provided)
  - Company (if provided)
  - Submitted date
  - Email status with timestamp/error
  - Full message content
- Auto-marks as viewed when opened
- Delete button in modal

**5. Actions**
- **Mark as viewed** - Automatically when opening details
- **Toggle viewed status** - (Not exposed in UI, but function exists)
- **Delete** - With confirmation dialog

### Code Snippets

**Fetching submissions:**
```typescript
// src/components/admin/SubmissionsEditor.tsx (lines 35-57)

const loadSubmissions = async () => {
  setLoading(true);
  try {
    let query = supabase
      .from('contact_submissions')
      .select('*')
      .order(sortField, { ascending: sortDirection === 'asc' });

    if (filter === 'unviewed') {
      query = query.eq('viewed', false);
    }

    const { data, error } = await query;

    if (error) throw error;
    setSubmissions(data || []);
  } catch (error) {
    console.error('Error loading submissions:', error);
    alert('Failed to load submissions');
  } finally {
    setLoading(false);
  }
};
```

**Marking as viewed:**
```typescript
// src/components/admin/SubmissionsEditor.tsx (lines 59-100)

const markAsViewed = async (submission: ContactSubmission) => {
  if (submission.viewed) return;

  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('contact_submissions')
      .update({
        viewed: true,
        viewed_at: new Date().toISOString(),
        viewed_by: user?.id || null,
      })
      .eq('id', submission.id);

    if (error) throw error;

    // Update local state
    const updatedSubmission = {
      ...submission,
      viewed: true,
      viewed_at: new Date().toISOString()
    };

    setSubmissions(prev =>
      prev.map(s =>
        s.id === submission.id ? updatedSubmission : s
      )
    );

    if (selectedSubmission?.id === submission.id) {
      setSelectedSubmission(updatedSubmission);
    }

    await loadSubmissions();
  } catch (error) {
    console.error('Error marking as viewed:', error);
    alert('Failed to mark as viewed. Please try again.');
  }
};
```

**Deleting submission:**
```typescript
// src/components/admin/SubmissionsEditor.tsx (lines 140-158)

const deleteSubmission = async (id: string) => {
  if (!confirm('Are you sure you want to delete this submission?')) return;

  try {
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setSubmissions(prev => prev.filter(s => s.id !== id));
    setSelectedSubmission(null);
    await loadSubmissions();
  } catch (error) {
    console.error('Error deleting submission:', error);
    alert('Failed to delete submission');
  }
};
```

**Admin Service Methods:**
```typescript
// src/services/adminService.ts (lines 162-180)

async getContactSubmissions() {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
},

async getUnreadSubmissionsCount() {
  const { count, error } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('viewed', false);

  if (error) throw error;
  return { count };
},
```

**Access Control:**
- Component is rendered in `AdminDashboard.tsx` under `'submissions'` tab
- Requires authentication (handled by `AdminDashboard` auth check)
- Uses Supabase RLS policies (authenticated users only)

---

## E) Required Settings / Env Vars

### Environment Variables

**Frontend (.env):**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Edge Function (Supabase Dashboard / Secrets):**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Database Settings (in `site_settings` table)

**CAPTCHA Mode:**
- `captcha_mode` - `'testing'` or `'google'` (default: `'testing'`)

### Database Settings (in `smtp_settings` table)

**SMTP Configuration:**
- `smtp_host` - SMTP server (e.g., `'smtp.gmail.com'`)
- `smtp_port` - Port number (e.g., `587` for TLS, `465` for SSL)
- `smtp_secure` - Boolean (use TLS/SSL)
- `smtp_user` - SMTP username/email
- `smtp_password` - SMTP password or app password
- `from_email` - Sender email address
- `from_name` - Sender display name
- `recaptcha_site_key` - Google reCAPTCHA v2 site key (public)
- `recaptcha_secret_key` - Google reCAPTCHA v2 secret key (private, not used in frontend)

### Database Settings (in `contact_content` table)

**Email Target:**
- `target_email` - Email address to receive submissions (used by trigger, currently not active)

---

## F) Copy Checklist for Porting to Another Project

### ✅ Frontend Components
- [ ] Copy `src/components/sections/ContactSection.tsx`
- [ ] Copy `src/components/MathCaptcha.tsx` (for testing mode CAPTCHA)
- [ ] Add reCAPTCHA script to `index.html`: `<script src="https://www.google.com/recaptcha/api.js" async defer></script>`
- [ ] Update imports/paths as needed

### ✅ Database Schema
- [ ] Run migration: `20251109104515_create_cms_schema.sql` (contact_submissions table)
- [ ] Run migration: `20251111132526_add_phone_and_email_trigger.sql` (add phone, email tracking)
- [ ] Run migration: `20251111144746_add_viewed_flag_to_submissions.sql` (add viewed tracking)
- [ ] Run migration: `20251111183702_add_update_delete_policies_to_submissions.sql` (add UPDATE/DELETE policies)
- [ ] Run migration: `20251219075719_fix_security_issues.sql` (security fixes, indexes)
- [ ] Verify RLS policies are active
- [ ] Create `smtp_settings` table (see `20251110070956_add_smtp_settings.sql`)
- [ ] Create `contact_content` table (for target_email, if using trigger)

### ✅ Backend / Edge Function
- [ ] Copy `supabase/functions/send-contact-email/index.ts`
- [ ] Deploy Edge Function: `supabase functions deploy send-contact-email`
- [ ] Set Edge Function secrets:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Update database trigger URL (if using trigger) to point to Edge Function
- [ ] Install Edge Function dependencies (emailjs, supabase-js)

### ✅ Admin Panel
- [ ] Copy `src/components/admin/SubmissionsEditor.tsx`
- [ ] Add `'submissions'` tab to admin dashboard
- [ ] Import and render `SubmissionsEditor` component
- [ ] Add `getContactSubmissions()` and `getUnreadSubmissionsCount()` to admin service

### ✅ Services
- [ ] Add contact form submission logic (direct Supabase insert)
- [ ] Add admin service methods for fetching/managing submissions
- [ ] Add CAPTCHA settings loading logic

### ✅ Types
- [ ] Copy `ContactSubmission` interface from `src/types/cms.ts`
- [ ] Copy `ContactContent` interface (if using)
- [ ] Copy `SMTPSettings` interface (if using)

### ✅ Configuration
- [ ] Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
- [ ] Configure `site_settings.captcha_mode` (default: `'testing'`)
- [ ] Configure `smtp_settings` table with SMTP credentials
- [ ] Configure `smtp_settings.recaptcha_site_key` (if using Google reCAPTCHA)

### ✅ Testing
- [ ] Test form submission with testing mode CAPTCHA
- [ ] Test form submission with Google reCAPTCHA (if configured)
- [ ] Test admin panel: list, view, mark as viewed, delete
- [ ] Test email sending (check SMTP settings)
- [ ] Test RLS policies (try accessing as anonymous user)

### ⚠️ Notes
- The database trigger currently uses a placeholder URL. Update it to call your Edge Function if you want automatic email sending.
- The Edge Function is fire-and-forget (doesn't wait for email to send). Consider adding retry logic or error tracking.
- The `interest` field exists in the schema but is not used in the current form. You can remove it or add it to the form.
- CAPTCHA validation happens client-side. Consider adding server-side validation for production.

---

## Summary

**Current Implementation:**
- Frontend submits directly to Supabase database (no Edge Function call)
- Database trigger exists but uses placeholder URL (not active)
- Edge Function exists and can send emails, but not called by trigger
- Admin panel provides full CRUD for submissions
- Two CAPTCHA modes: testing (math) and Google reCAPTCHA v2

**Recommended for Porting:**
1. Use direct Supabase insert (simpler, current approach)
2. Optionally call Edge Function from frontend after successful insert
3. Or update database trigger to call Edge Function with correct URL
4. Keep admin panel for managing submissions
5. Configure SMTP settings in database for email functionality

