import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import type { SiteSettings } from '../types/cms';

interface CustomPageProps {
  slug: string;
}

interface PageData {
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
}

export function CustomPage({ slug }: CustomPageProps) {
  const [page, setPage] = useState<PageData | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    try {
      const [pageResult, settingsResult] = await Promise.all([
        supabase
          .from('custom_pages')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .maybeSingle(),
        supabase.from('site_settings').select('*').single(),
      ]);

      if (pageResult.data) {
        setPage(pageResult.data);
        document.title = language === 'bg' ? pageResult.data.meta_title_bg : pageResult.data.meta_title_en;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute(
            'content',
            language === 'bg' ? pageResult.data.meta_description_bg : pageResult.data.meta_description_en
          );
        }
      } else {
        setNotFound(true);
      }

      if (settingsResult.data) {
        setSettings(settingsResult.data);
      }
    } catch (error) {
      console.error('Error loading page:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header settings={settings} isCustomPage={true} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">
              {language === 'bg' ? 'Страницата не е намерена' : 'Page not found'}
            </p>
            <a
              href="#/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {language === 'bg' ? 'Към началото' : 'Go Home'}
            </a>
          </div>
        </main>
        <Footer settings={settings} />
      </div>
    );
  }

  const title = language === 'bg' ? page.title_bg : page.title_en;
  const content = language === 'bg' ? page.content_bg : page.content_en;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header settings={settings} isCustomPage={true} />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <article className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">{title}</h1>
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        </div>
      </main>
      <Footer settings={settings} />
    </div>
  );
}
