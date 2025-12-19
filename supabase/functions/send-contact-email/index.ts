import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { SMTPClient } from 'npm:emailjs@4.0.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey, X-Requested-With',
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  recaptchaToken: string;
}

Deno.serve(async (req: Request) => {
  console.log('=== Edge Function Called ===');
  console.log('Method:', req.method);

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    console.log('Starting request processing...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Parsing request body...');
    const { name, email, phone, company, message, recaptchaToken }: ContactFormData = await req.json();
    console.log('Received form data:', { name, email, messageLength: message?.length });

    const sendEmailAsync = async () => {
      try {
        console.log('Fetching SMTP settings...');
        const { data: smtpSettings, error: settingsError } = await supabase
          .from('smtp_settings')
          .select('*')
          .maybeSingle();

        if (settingsError || !smtpSettings) {
          console.error('Error fetching SMTP settings:', settingsError);
          return;
        }

        console.log('SMTP settings loaded');

        const emailHtml = `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `;

        const emailText = `
New Contact Form Submission

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
${company ? `Company: ${company}` : ''}

Message:
${message}
        `;

        console.log('Creating SMTP client...');
        const client = new SMTPClient({
          user: smtpSettings.smtp_user,
          password: smtpSettings.smtp_password,
          host: smtpSettings.smtp_host,
          port: smtpSettings.smtp_port,
          ssl: smtpSettings.smtp_port === 465,
          tls: smtpSettings.smtp_port === 587,
        });

        const messagePayload = {
          text: emailText,
          from: `${smtpSettings.from_name} <${smtpSettings.smtp_user}>`,
          to: smtpSettings.smtp_user,
          subject: `New Contact Form - ${name}`,
          attachment: [
            { data: emailHtml, alternative: true },
          ],
        };

        console.log('Sending email...');
        await client.sendAsync(messagePayload);
        console.log('✅ Email sent successfully!');
      } catch (emailError) {
        console.error('❌ Error sending email:', emailError);
      }
    };

    sendEmailAsync();

    console.log('=== Request completed successfully ===');
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Message received'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Error in send-contact-email:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});