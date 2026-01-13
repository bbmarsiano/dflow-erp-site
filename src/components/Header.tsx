import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SiteSettings } from '../types/cms';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { getLogoScaleStyle } from '../utils/logoScale';

function getSloganFontFamily(setting: string | null | undefined): string {
  switch (setting) {
    case 'sans':
      return 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    case 'serif':
      return 'ui-serif, Georgia, "Times New Roman", serif';
    case 'mono':
      return 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
    case 'system':
    default:
      return 'inherit';
  }
}

function darkenHexColor(hex: string, amount: number = 0.4): string {
  // Validate hex format (#rrggbb)
  if (!hex || !/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    return '#111827'; // Default dark gray (Tailwind gray-900)
  }

  // Parse hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Darken each channel by multiplying by (1 - amount)
  const darkenedR = Math.max(0, Math.min(255, Math.round(r * (1 - amount))));
  const darkenedG = Math.max(0, Math.min(255, Math.round(g * (1 - amount))));
  const darkenedB = Math.max(0, Math.min(255, Math.round(b * (1 - amount))));

  // Convert back to hex
  return `#${darkenedR.toString(16).padStart(2, '0')}${darkenedG.toString(16).padStart(2, '0')}${darkenedB.toString(16).padStart(2, '0')}`;
}

interface HeaderProps {
  settings: SiteSettings | null;
  isCustomPage?: boolean;
}

interface NavItem {
  id: string;
  label_en: string;
  label_bg: string;
  section_id: string;
  item_order: number;
  is_visible: boolean;
}

interface CustomPageNav {
  id: string;
  slug: string;
  title_en: string;
  title_bg: string;
  order_index: number;
}

export function Header({ settings, isCustomPage = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(isCustomPage);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [customPages, setCustomPages] = useState<CustomPageNav[]>([]);
  const [siteName, setSiteName] = useState({ en: 'DFlow ERP', bg: 'DFlow ERP' });
  const [blogEnabled, setBlogEnabled] = useState(false);
  const [blogLabel, setBlogLabel] = useState({ bg: 'Блог', en: 'Blog' });
  const [hasPublishedPosts, setHasPublishedPosts] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(isCustomPage || window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCustomPage]);

  useEffect(() => {
    loadHeaderContent();
  }, []);

  const loadHeaderContent = async () => {
    try {
      const [navResult, settingsResult, pagesResult, blogPostsResult] = await Promise.all([
        supabase.from('header_nav_items').select('*').eq('is_visible', true).order('item_order'),
        supabase.from('site_settings').select('site_name_en, site_name_bg, blog_menu_enabled, blog_menu_label_bg, blog_menu_label_en').single(),
        supabase.from('custom_pages').select('id, slug, title_en, title_bg, order_index').eq('is_published', true).eq('show_in_nav', true).order('order_index'),
        supabase.from('blog_posts').select('id').eq('is_published', true).limit(1),
      ]);

      if (navResult.data && navResult.data.length > 0) {
        setNavItems(navResult.data);
      }

      if (pagesResult.data && pagesResult.data.length > 0) {
        setCustomPages(pagesResult.data);
      }

      if (settingsResult.data) {
        setSiteName({
          en: settingsResult.data.site_name_en || 'DFlow ERP',
          bg: settingsResult.data.site_name_bg || 'DFlow ERP',
        });
        setBlogEnabled(settingsResult.data.blog_menu_enabled === 'true');
        setBlogLabel({
          bg: settingsResult.data.blog_menu_label_bg || 'Блог',
          en: settingsResult.data.blog_menu_label_en || 'Blog',
        });
      }

      if (blogPostsResult.data && blogPostsResult.data.length > 0) {
        setHasPublishedPosts(true);
      }
    } catch (error) {
      console.error('Error loading header content:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    // Check if we're on the homepage
    const isOnHomepage = window.location.pathname === '/';
    
    if (isOnHomepage) {
      // If on homepage, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false);
      }
    } else {
      // If on another page, navigate to homepage with hash
      window.location.href = `/#${sectionId}`;
      setIsMobileMenuOpen(false);
    }
  };

  const navigateToPage = (slug: string) => {
    window.location.href = `/${slug}`;
    setIsMobileMenuOpen(false);
  };

  const navigateToHome = () => {
    window.location.href = '/';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={navigateToHome}>
            {settings?.logo_url ? (
              <div className="flex flex-col">
                <div style={getLogoScaleStyle(settings.logo_scale)} className="inline-block">
                  <img 
                    src={settings.logo_url} 
                    alt={siteName[language]} 
                    className="h-8 w-auto"
                  />
                </div>
                {(settings.site_slogan_en || settings.site_slogan_bg) && (() => {
                  const baseColor = settings.slogan_color || '#ffffff';
                  const effectiveColor = isScrolled
                    ? darkenHexColor(baseColor, 0.4)
                    : baseColor;
                  const sloganStyle: React.CSSProperties = {
                    color: effectiveColor,
                    fontFamily: getSloganFontFamily(settings.slogan_font_family),
                    fontWeight: settings.slogan_font_bold ? 'bold' : 'normal',
                    fontStyle: settings.slogan_font_italic ? 'italic' : 'normal',
                    textDecoration: settings.slogan_font_underline ? 'underline' : 'none',
                  };
                  return (
                    <span className="text-xs tracking-wide mt-2" style={sloganStyle}>
                      {language === 'bg' ? settings.site_slogan_bg : settings.site_slogan_en}
                    </span>
                  );
                })()}
              </div>
            ) : (
              <div className="flex flex-col">
                <div 
                  className="flex items-center space-x-2 inline-block"
                  style={getLogoScaleStyle(settings?.logo_scale)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg"></div>
                  <span className={`text-xl font-bold leading-none ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                    {siteName[language]}
                  </span>
                </div>
                {(settings?.site_slogan_en || settings?.site_slogan_bg) && (() => {
                  const baseColor = settings.slogan_color || '#ffffff';
                  const effectiveColor = isScrolled
                    ? darkenHexColor(baseColor, 0.4)
                    : baseColor;
                  const sloganStyle: React.CSSProperties = {
                    color: effectiveColor,
                    fontFamily: getSloganFontFamily(settings.slogan_font_family),
                    fontWeight: settings.slogan_font_bold ? 'bold' : 'normal',
                    fontStyle: settings.slogan_font_italic ? 'italic' : 'normal',
                    textDecoration: settings.slogan_font_underline ? 'underline' : 'none',
                  };
                  return (
                    <span className="text-xs ml-10 tracking-wide mt-2" style={sloganStyle}>
                      {language === 'bg' ? settings?.site_slogan_bg : settings?.site_slogan_en}
                    </span>
                  );
                })()}
              </div>
            )}
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.section_id)}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {language === 'bg' ? item.label_bg : item.label_en}
              </button>
            ))}
            {customPages.map((page) => (
              <button
                key={page.id}
                onClick={() => navigateToPage(page.slug)}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {language === 'bg' ? page.title_bg : page.title_en}
              </button>
            ))}
            {blogEnabled && hasPublishedPosts && (
              <button
                onClick={() => {
                  window.location.href = '/blog';
                  setIsMobileMenuOpen(false);
                }}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {language === 'bg' ? blogLabel.bg : blogLabel.en}
              </button>
            )}
            <LanguageSwitcher />
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? 'text-gray-900' : 'text-white'} />
            ) : (
              <Menu className={isScrolled ? 'text-gray-900' : 'text-white'} />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.section_id)}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                {language === 'bg' ? item.label_bg : item.label_en}
              </button>
            ))}
            {customPages.map((page) => (
              <button
                key={page.id}
                onClick={() => navigateToPage(page.slug)}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                {language === 'bg' ? page.title_bg : page.title_en}
              </button>
            ))}
            {blogEnabled && hasPublishedPosts && (
              <button
                onClick={() => {
                  window.location.href = '/blog';
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                {language === 'bg' ? blogLabel.bg : blogLabel.en}
              </button>
            )}
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
