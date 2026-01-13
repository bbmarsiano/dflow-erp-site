import { supabase } from '../lib/supabase';
import type {
  SiteSettings,
  HeroContent,
  FeatureCard,
  ProcessStep,
  Package,
  Integration,
  ConsultingContent,
  Testimonial,
  ContactContent,
  LegalPage,
  WhyChoosePopup,
  IntegrationPopup,
  PlatformLogo,
  CustomPage,
  CookieConsentSettings,
  SMTPSettings,
} from '../types/cms';

export const adminService = {
  async updateSiteSettings(data: Partial<SiteSettings>): Promise<void> {
    const { error } = await supabase
      .from('site_settings')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', data.id);

    if (error) throw error;
  },

  async updateHeroContent(data: Partial<HeroContent>): Promise<void> {
    const { error } = await supabase
      .from('hero_content')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', data.id);

    if (error) throw error;
  },

  async createFeatureCard(data: Omit<FeatureCard, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase.from('feature_cards').insert([data]);
    if (error) throw error;
  },

  async updateFeatureCard(id: string, data: Partial<FeatureCard>): Promise<void> {
    const { error } = await supabase.from('feature_cards').update(data).eq('id', id);
    if (error) throw error;
  },

  async deleteFeatureCard(id: string): Promise<void> {
    const { error } = await supabase.from('feature_cards').delete().eq('id', id);
    if (error) throw error;
  },

  async createProcessStep(data: Omit<ProcessStep, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase.from('process_steps').insert([data]);
    if (error) throw error;
  },

  async updateProcessStep(id: string, data: Partial<ProcessStep>): Promise<void> {
    const { error } = await supabase.from('process_steps').update(data).eq('id', id);
    if (error) throw error;
  },

  async deleteProcessStep(id: string): Promise<void> {
    const { error } = await supabase.from('process_steps').delete().eq('id', id);
    if (error) throw error;
  },

  async getAllPackages(): Promise<Package[]> {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createPackage(data: Omit<Package, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase.from('packages').insert([data]);
    if (error) throw error;
  },

  async updatePackage(id: string, data: Partial<Package>): Promise<void> {
    if (data.is_featured === true) {
      const { error: unfeaturedError } = await supabase
        .from('packages')
        .update({ is_featured: false })
        .neq('id', id);

      if (unfeaturedError) throw unfeaturedError;
    }

    const { error } = await supabase.from('packages').update(data).eq('id', id);
    if (error) throw error;
  },

  async deletePackage(id: string): Promise<void> {
    const { error } = await supabase.from('packages').delete().eq('id', id);
    if (error) throw error;
  },

  async createIntegration(data: Omit<Integration, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase.from('integrations').insert([data]);
    if (error) throw error;
  },

  async updateIntegration(id: string, data: Partial<Integration>): Promise<void> {
    const { error } = await supabase.from('integrations').update(data).eq('id', id);
    if (error) throw error;
  },

  async deleteIntegration(id: string): Promise<void> {
    const { error } = await supabase.from('integrations').delete().eq('id', id);
    if (error) throw error;
  },

  async updateConsultingContent(data: Partial<ConsultingContent>): Promise<void> {
    const { error } = await supabase
      .from('consulting_content')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', data.id);

    if (error) throw error;
  },

  async getAllTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createTestimonial(data: Omit<Testimonial, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase.from('testimonials').insert([data]);
    if (error) throw error;
  },

  async updateTestimonial(id: string, data: Partial<Testimonial>): Promise<void> {
    const { error } = await supabase.from('testimonials').update(data).eq('id', id);
    if (error) throw error;
  },

  async deleteTestimonial(id: string): Promise<void> {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
  },

  async updateContactContent(data: Partial<ContactContent>): Promise<void> {
    const { error } = await supabase
      .from('contact_content')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', data.id);

    if (error) throw error;
  },

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

  async updateLegalPage(id: string, data: Partial<LegalPage>): Promise<void> {
    const { error } = await supabase
      .from('legal_pages')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },

  async updateWhyChoosePopup(id: string, data: Partial<WhyChoosePopup>): Promise<void> {
    const { error } = await supabase
      .from('why_choose_popups')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },

  async updateIntegrationPopup(id: string, data: Partial<IntegrationPopup>): Promise<void> {
    const { error } = await supabase
      .from('integration_popups')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },

  async getAllPlatformLogos(): Promise<PlatformLogo[]> {
    const { data, error } = await supabase
      .from('platform_logos')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createPlatformLogo(data: Omit<PlatformLogo, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase.from('platform_logos').insert([data]);
    if (error) throw error;
  },

  async updatePlatformLogo(id: string, data: Partial<PlatformLogo>): Promise<void> {
    const { error } = await supabase.from('platform_logos').update(data).eq('id', id);
    if (error) throw error;
  },

  async deletePlatformLogo(id: string): Promise<void> {
    const { error } = await supabase.from('platform_logos').delete().eq('id', id);
    if (error) throw error;
  },

  async getAllCustomPages(): Promise<CustomPage[]> {
    const { data, error } = await supabase
      .from('custom_pages')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createCustomPage(data: Omit<CustomPage, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const { error } = await supabase.from('custom_pages').insert([data]);
    if (error) throw error;
  },

  async updateCustomPage(id: string, data: Partial<CustomPage>): Promise<void> {
    const { error } = await supabase
      .from('custom_pages')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },

  async deleteCustomPage(id: string): Promise<void> {
    const { error } = await supabase.from('custom_pages').delete().eq('id', id);
    if (error) throw error;
  },

  async getCookieConsentSettings(): Promise<CookieConsentSettings | null> {
    const { data, error } = await supabase
      .from('cookie_consent_settings')
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateCookieConsentSettings(data: Partial<CookieConsentSettings>): Promise<void> {
    const settings = await this.getCookieConsentSettings();

    if (settings) {
      const { error } = await supabase
        .from('cookie_consent_settings')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', settings.id);

      if (error) throw error;
    } else {
      const { error } = await supabase.from('cookie_consent_settings').insert([data]);
      if (error) throw error;
    }
  },

  async getSMTPSettings(): Promise<SMTPSettings | null> {
    const { data, error } = await supabase
      .from('smtp_settings')
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateSMTPSettings(data: Partial<SMTPSettings>): Promise<void> {
    const settings = await this.getSMTPSettings();

    if (settings) {
      const { error } = await supabase
        .from('smtp_settings')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', settings.id);

      if (error) throw error;
    } else {
      const { error } = await supabase.from('smtp_settings').insert([data]);
      if (error) throw error;
    }
  },

  async getAllERPModules(): Promise<import('../types/cms').ERPModule[]> {
    const { data, error } = await supabase
      .from('erp_modules')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async updateERPModules(modules: import('../types/cms').ERPModule[]): Promise<void> {
    const { error: deleteError } = await supabase.from('erp_modules').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) throw deleteError;

    if (modules.length > 0) {
      const { error: insertError } = await supabase.from('erp_modules').insert(modules);
      if (insertError) throw insertError;
    }
  },

  async getAllBlogPosts(): Promise<import('../types/cms').BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createBlogPost(data: Omit<import('../types/cms').BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    // Ensure all required NOT NULL fields are provided
    const insertData = {
      slug: data.slug || '',
      title_bg: data.title_bg || '',
      title_en: data.title_en || '',
      excerpt_bg: data.excerpt_bg || '',
      excerpt_en: data.excerpt_en || '',
      content_bg: data.content_bg || '',
      content_en: data.content_en || '',
      client_name: data.client_name || null,
      client_industry: data.client_industry || null,
      is_published: data.is_published ?? false,
      show_on_home: data.show_on_home ?? false,
      show_in_footer: data.show_in_footer ?? false,
      published_at: data.is_published && !data.published_at ? new Date().toISOString() : (data.published_at || null),
    };

    const { error } = await supabase.from('blog_posts').insert([insertData]);

    if (error) {
      console.error('Blog post creation error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }
  },

  async updateBlogPost(id: string, data: Partial<import('../types/cms').BlogPost>): Promise<void> {
    const updateData: any = { ...data, updated_at: new Date().toISOString() };
    
    // Set published_at when publishing for the first time
    if (data.is_published && !data.published_at) {
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('published_at')
        .eq('id', id)
        .single();
      
      if (existing && !existing.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { error } = await supabase.from('blog_posts').update(updateData).eq('id', id);
    
    if (error) {
      console.error('Blog post update error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }
  },

  async deleteBlogPost(id: string): Promise<void> {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
  },
};
