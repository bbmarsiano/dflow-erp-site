import { useState, useEffect } from 'react';
import { Linkedin, Youtube, Facebook } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SiteSettings } from '../types/cms';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedField } from '../utils/language';
import { getLogoScaleStyle } from '../utils/logoScale';

interface FooterProps {
  settings: SiteSettings | null;
}

interface FooterSection {
  id: string;
  title_en: string;
  title_bg: string;
  section_order: number;
}

interface FooterLink {
  id: string;
  section_id: string;
  label_en: string;
  label_bg: string;
  url: string;
  link_order: number;
  is_external: boolean;
}

export function Footer({ settings }: FooterProps) {
  const { language } = useLanguage();
  const [sections, setSections] = useState<FooterSection[]>([]);
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [footerSettings, setFooterSettings] = useState<{
    footer_description_en: string | null;
    footer_description_bg: string | null;
    footer_copyright_en: string | null;
    footer_copyright_bg: string | null;
  }>({
    footer_description_en: null,
    footer_description_bg: null,
    footer_copyright_en: null,
    footer_copyright_bg: null,
  });

  useEffect(() => {
    loadFooterContent();
  }, [settings]);

  const loadFooterContent = async () => {
    try {
      const [sectionsResult, linksResult, settingsResult, blogResult] = await Promise.all([
        supabase.from('footer_sections').select('*').order('section_order'),
        supabase.from('footer_links').select('*').order('link_order'),
        supabase.from('site_settings').select('footer_description_en, footer_description_bg, footer_copyright_en, footer_copyright_bg, blog_footer_links_enabled').single(),
        settings?.blog_footer_links_enabled === 'true'
          ? supabase.from('blog_posts').select('id, slug, title_bg, title_en').eq('is_published', true).eq('show_in_footer', true).order('published_at', { ascending: false }).limit(10)
          : Promise.resolve({ data: null, error: null }),
      ]);

      if (sectionsResult.data) setSections(sectionsResult.data);
      if (linksResult.data) setLinks(linksResult.data);
      if (settingsResult.data) setFooterSettings(settingsResult.data);
      if (blogResult.data) setBlogPosts(blogResult.data);
    } catch (error) {
      console.error('Error loading footer content:', error);
    }
  };

  const getDescription = () => {
    if (language === 'bg' && footerSettings.footer_description_bg) {
      return footerSettings.footer_description_bg;
    }
    if (footerSettings.footer_description_en) {
      return footerSettings.footer_description_en;
    }
    return language === 'bg'
      ? 'Персонализирани ERP решения базирани на Odoo и Dolibarr'
      : 'Tailored ERP solutions based on Odoo and Dolibarr';
  };

  const getCopyright = () => {
    if (language === 'bg' && footerSettings.footer_copyright_bg) {
      return footerSettings.footer_copyright_bg;
    }
    if (footerSettings.footer_copyright_en) {
      return footerSettings.footer_copyright_en;
    }
    return 'DFlow ERP © 2025';
  };

  const companySection = sections.find(s => s.title_en === 'Company');
  const otherSections = sections.filter(s => s.title_en !== 'Company');

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {settings?.logo_url ? (
                <div style={getLogoScaleStyle(settings.logo_scale)} className="inline-block">
                  <img 
                    src={settings.logo_url} 
                    alt="DFlow ERP" 
                    className="h-8 w-auto"
                  />
                </div>
              ) : (
                <div style={getLogoScaleStyle(settings?.logo_scale)} className="inline-block">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg"></div>
                    <span className="text-xl font-bold text-white">DFlow ERP</span>
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm">{getDescription()}</p>
          </div>

          {companySection && (
            <div>
              <h3 className="text-white font-semibold mb-4">
                {language === 'bg' ? companySection.title_bg : companySection.title_en}
              </h3>
              <div className="space-y-2 text-sm">
                {getLocalizedField(settings, 'company_name', language) && (
                  <p>{getLocalizedField(settings, 'company_name', language)}</p>
                )}
                {getLocalizedField(settings, 'company_address', language) && (
                  <p>{getLocalizedField(settings, 'company_address', language)}</p>
                )}
                {settings?.company_email && (
                  <p>
                    <a
                      href={`mailto:${settings.company_email}`}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {settings.company_email}
                    </a>
                  </p>
                )}
                {settings?.company_phone && <p>{settings.company_phone}</p>}
              </div>
            </div>
          )}

          {otherSections.map((section) => {
            const sectionLinks = links.filter((link) => link.section_id === section.id);
            if (sectionLinks.length === 0) return null;

            return (
              <div key={section.id}>
                <h3 className="text-white font-semibold mb-4">
                  {language === 'bg' ? section.title_bg : section.title_en}
                </h3>
                <div className="space-y-2 text-sm">
                  {sectionLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      className="block hover:text-blue-400 transition-colors"
                      target={link.is_external ? '_blank' : undefined}
                      rel={link.is_external ? 'noopener noreferrer' : undefined}
                    >
                      {language === 'bg' ? link.label_bg : link.label_en}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}

          {settings?.blog_footer_links_enabled === 'true' && blogPosts.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-4">
                {settings?.blog_menu_label_bg && settings?.blog_menu_label_en
                  ? (language === 'bg' ? settings.blog_menu_label_bg : settings.blog_menu_label_en)
                  : (language === 'bg' ? 'Блог' : 'Blog')}
              </h3>
              <div className="space-y-2 text-sm">
                {blogPosts.map((post) => (
                  <a
                    key={post.id}
                    href={`/insights/${post.slug}`}
                    className="block hover:text-blue-400 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/insights/${post.slug}`;
                    }}
                  >
                    {language === 'bg' ? post.title_bg : post.title_en}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            {getCopyright()} — {settings?.company_name || 'Balkan Invest Consult'}
            <a
              href="/admin"
              className="text-gray-300 hover:text-blue-400 transition-colors"
              aria-label="Admin"
              title="Admin Panel"
            >
              .
            </a>
          </p>

          <div className="flex items-center space-x-4">
            {settings?.linkedin_url && (
              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            )}
            {settings?.youtube_url && (
              <a
                href={settings.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            )}
            {settings?.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
