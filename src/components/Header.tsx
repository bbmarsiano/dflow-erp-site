import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SiteSettings } from '../types/cms';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

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
      const [navResult, settingsResult, pagesResult] = await Promise.all([
        supabase.from('header_nav_items').select('*').eq('is_visible', true).order('item_order'),
        supabase.from('site_settings').select('site_name_en, site_name_bg').single(),
        supabase.from('custom_pages').select('id, slug, title_en, title_bg, order_index').eq('is_published', true).eq('show_in_nav', true).order('order_index'),
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
      }
    } catch (error) {
      console.error('Error loading header content:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navigateToPage = (slug: string) => {
    window.location.href = `/${slug}`;
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('home')}>
            {settings?.logo_url ? (
              <div className="flex flex-col">
                <img src={settings.logo_url} alt={siteName[language]} className="h-8 w-auto" />
                {(settings.site_slogan_en || settings.site_slogan_bg) && (
                  <span className="text-xs text-sky-700 tracking-wide mt-2">
                    {language === 'bg' ? settings.site_slogan_bg : settings.site_slogan_en}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg"></div>
                  <span className={`text-xl font-bold leading-none ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                    {siteName[language]}
                  </span>
                </div>
                {(settings?.site_slogan_en || settings?.site_slogan_bg) && (
                  <span className={`text-xs ml-10 tracking-wide mt-2 ${isScrolled ? 'text-sky-700' : 'text-sky-200'}`}>
                    {language === 'bg' ? settings?.site_slogan_bg : settings?.site_slogan_en}
                  </span>
                )}
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
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
