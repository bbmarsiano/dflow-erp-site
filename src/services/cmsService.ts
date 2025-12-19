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
  ContactSubmission,
  LegalPage,
  IntegrationPopup,
  WhyChoosePopup,
  PlatformLogo,
  CustomPage,
  CookieConsentSettings,
} from '../types/cms';

export const cmsService = {
  async getSiteSettings(): Promise<SiteSettings | null> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getHeroContent(): Promise<HeroContent | null> {
    const { data, error } = await supabase
      .from('hero_content')
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getFeatureCards(): Promise<FeatureCard[]> {
    const { data, error } = await supabase
      .from('feature_cards')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getProcessSteps(): Promise<ProcessStep[]> {
    const { data, error } = await supabase
      .from('process_steps')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getPackages(): Promise<Package[]> {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('is_visible', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getIntegrations(): Promise<Integration[]> {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getConsultingContent(): Promise<ConsultingContent | null> {
    const { data, error } = await supabase
      .from('consulting_content')
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_visible', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getContactContent(): Promise<ContactContent | null> {
    const { data, error } = await supabase
      .from('contact_content')
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async submitContactForm(submission: ContactSubmission): Promise<void> {
    const { error } = await supabase
      .from('contact_submissions')
      .insert([submission]);

    if (error) throw error;
  },

  async getLegalPage(pageType: 'privacy' | 'cookies'): Promise<LegalPage | null> {
    const { data, error } = await supabase
      .from('legal_pages')
      .select('*')
      .eq('page_type', pageType)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getIntegrationPopups(): Promise<IntegrationPopup[]> {
    const { data, error } = await supabase
      .from('integration_popups')
      .select('*');

    if (error) throw error;
    return data || [];
  },

  async getIntegrationPopup(popupKey: string): Promise<IntegrationPopup | null> {
    const { data, error } = await supabase
      .from('integration_popups')
      .select('*')
      .eq('popup_key', popupKey)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getWhyChoosePopups(): Promise<WhyChoosePopup[]> {
    const { data, error } = await supabase
      .from('why_choose_popups')
      .select('*');

    if (error) throw error;
    return data || [];
  },

  async getWhyChoosePopup(popupKey: string): Promise<WhyChoosePopup | null> {
    const { data, error } = await supabase
      .from('why_choose_popups')
      .select('*')
      .eq('popup_key', popupKey)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getPlatformLogos(): Promise<PlatformLogo[]> {
    const { data, error } = await supabase
      .from('platform_logos')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getCustomPages(publishedOnly: boolean = true): Promise<CustomPage[]> {
    let query = supabase.from('custom_pages').select('*');

    if (publishedOnly) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query.order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getCustomPageBySlug(slug: string): Promise<CustomPage | null> {
    const { data, error } = await supabase
      .from('custom_pages')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getCookieConsentSettings(): Promise<CookieConsentSettings | null> {
    const { data, error} = await supabase
      .from('cookie_consent_settings')
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getRecaptchaSiteKey(): Promise<string> {
    const { data, error } = await supabase
      .from('smtp_settings')
      .select('recaptcha_site_key')
      .maybeSingle();

    if (error) throw error;
    return data?.recaptcha_site_key || '';
  },

  async getERPModules(): Promise<import('../types/cms').ERPModule[]> {
    const { data, error } = await supabase
      .from('erp_modules')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },
};
