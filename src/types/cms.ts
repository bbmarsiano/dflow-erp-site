export interface SiteSettings {
  id: string;
  logo_url: string;
  site_slogan_en?: string;
  site_slogan_bg?: string;
  captcha_mode?: string;
  hero_bg_image_url?: string;
  hero_bg_opacity?: number;
  modules_section_enabled?: boolean;
  show_integrations_section?: boolean;
  company_name: string;
  company_name_bg: string;
  company_name_en: string;
  company_address: string;
  company_address_bg: string;
  company_address_en: string;
  company_email: string;
  company_phone: string;
  linkedin_url: string;
  youtube_url: string;
  facebook_url: string;
  meta_title: string;
  meta_title_bg: string;
  meta_title_en: string;
  meta_description: string;
  meta_description_bg: string;
  meta_description_en: string;
  odoo_logo_url: string;
  dolibarr_logo_url: string;
  logo_scale?: string;
  accent_color?: string;
  button_primary_color?: string;
  button_primary_gradient_from?: string;
  button_primary_gradient_to?: string;
  button_primary_gradient_enabled?: string | boolean;
  button_secondary_color?: string;
  button_secondary_gradient_from?: string;
  button_secondary_gradient_to?: string;
  button_secondary_gradient_enabled?: string | boolean;
  hero_title_color?: string;
  hero_subtitle_color?: string;
  hero_slogan_color?: string;
  hero_title_font_weight?: string;
  slogan_color?: string;
  slogan_font_family?: string;
  slogan_font_bold?: boolean;
  slogan_font_italic?: boolean;
  slogan_font_underline?: boolean;
  blog_menu_enabled?: string;
  blog_menu_label_bg?: string;
  blog_menu_label_en?: string;
  blog_home_section_enabled?: string;
  blog_footer_links_enabled?: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title_bg: string;
  title_en: string;
  excerpt_bg: string;
  excerpt_en: string;
  content_bg: string;
  content_en: string;
  client_name: string | null;
  client_industry: string | null;
  is_published: boolean;
  show_on_home: boolean;
  show_in_footer: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface HeroContent {
  id: string;
  headline: string;
  headline_bg: string;
  headline_en: string;
  subheadline: string;
  subheadline_bg: string;
  subheadline_en: string;
  slogan: string;
  slogan_bg: string;
  slogan_en: string;
  cta_primary_text: string;
  cta_primary_text_bg: string;
  cta_primary_text_en: string;
  cta_secondary_text: string;
  cta_secondary_text_bg: string;
  cta_secondary_text_en: string;
  updated_at: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  title_bg: string;
  title_en: string;
  description: string;
  description_bg: string;
  description_en: string;
  icon_name: string;
  order_index: number;
  created_at: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  title_bg: string;
  title_en: string;
  description: string;
  description_bg: string;
  description_en: string;
  order_index: number;
  created_at: string;
}

export interface Package {
  id: string;
  name: string;
  name_bg: string;
  name_en: string;
  description: string;
  description_bg: string;
  description_en: string;
  erp_platform: string;
  erp_platform_bg: string;
  erp_platform_en: string;
  features: string[];
  features_bg: string[];
  features_en: string[];
  price_text: string;
  price_text_bg: string;
  price_text_en: string;
  cta_text: string;
  cta_text_bg: string;
  cta_text_en: string;
  deployment_options_en?: string;
  deployment_options_bg?: string;
  technical_details_en?: string;
  technical_details_bg?: string;
  cta_label_en?: string;
  cta_label_bg?: string;
  pricing_note_en?: string;
  pricing_note_bg?: string;
  popup_enabled?: boolean;
  popup_title_en?: string;
  popup_title_bg?: string;
  popup_content_en?: string;
  popup_content_bg?: string;
  popup_cta_label_en?: string;
  popup_cta_label_bg?: string;
  is_featured?: boolean;
  order_index: number;
  is_visible: boolean;
  created_at: string;
}

export interface Integration {
  id: string;
  title: string;
  title_bg: string;
  title_en: string;
  icon_name: string;
  order_index: number;
  created_at: string;
}

export interface ConsultingContent {
  id: string;
  section_title: string;
  section_title_bg: string;
  section_title_en: string;
  description: string;
  description_bg: string;
  description_en: string;
  bullet_points: string[];
  bullet_points_bg: string[];
  bullet_points_en: string[];
  cta_text: string;
  cta_text_bg: string;
  cta_text_en: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company: string;
  sector: string;
  quote: string;
  quote_bg: string;
  quote_en: string;
  order_index: number;
  is_visible: boolean;
  created_at: string;
}

export interface ContactContent {
  id: string;
  section_title: string;
  section_title_bg: string;
  section_title_en: string;
  subheadline: string;
  subheadline_bg: string;
  subheadline_en: string;
  success_message: string;
  success_message_bg: string;
  success_message_en: string;
  target_email: string;
  updated_at: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
}

export interface LegalPage {
  id: string;
  page_type: 'privacy' | 'cookies';
  title_bg: string;
  title_en: string;
  content: string;
  content_bg: string;
  content_en: string;
  updated_at: string;
}

export interface IntegrationPopup {
  id: string;
  popup_key: 'integration_api_system' | 'integration_financial_systems' | 'integration_ecommerce' | 'integration_analytics' | 'integration_sso' | 'integration_custom';
  title_en: string;
  title_bg: string;
  body_en: string;
  body_bg: string;
  technical_details_en: string[];
  technical_details_bg: string[];
  created_at: string;
  updated_at: string;
}

export interface WhyChoosePopup {
  id: string;
  popup_key: 'why_flexibility' | 'why_cost' | 'why_expert' | 'why_control';
  title_en: string;
  title_bg: string;
  body_en: string;
  body_bg: string;
  card_description_en: string;
  card_description_bg: string;
  technical_details_en: string[];
  technical_details_bg: string[];
  created_at: string;
  updated_at: string;
}

export interface PlatformLogo {
  id: string;
  name_en: string;
  name_bg: string;
  logo_url: string;
  order_index: number;
  created_at: string;
}

export interface CustomPage {
  id: string;
  slug: string;
  title_en: string;
  title_bg: string;
  content_en: string;
  content_bg: string;
  meta_title_en: string;
  meta_title_bg: string;
  meta_description_en: string;
  meta_description_bg: string;
  is_published: boolean;
  order_index: number;
  show_in_nav: boolean;
  created_at: string;
  updated_at: string;
}

export interface CookieConsentSettings {
  id: string;
  title_en: string;
  title_bg: string;
  message_en: string;
  message_bg: string;
  accept_button_en: string;
  accept_button_bg: string;
  decline_button_en: string;
  decline_button_bg: string;
  learn_more_text_en: string;
  learn_more_text_bg: string;
  is_enabled: boolean;
  updated_at: string;
}

export interface SMTPSettings {
  id: string;
  smtp_host: string;
  smtp_port: number;
  smtp_secure: boolean;
  smtp_user: string;
  smtp_password: string;
  from_email: string;
  from_name: string;
  recaptcha_site_key: string;
  recaptcha_secret_key: string;
  updated_at: string;
}

export interface ERPModule {
  id: string;
  title_en: string;
  title_bg: string;
  description_en: string;
  description_bg: string;
  screenshot_url?: string;
  platform?: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}
