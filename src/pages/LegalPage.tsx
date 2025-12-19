import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cmsService } from '../services/cmsService';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedField } from '../utils/language';
import type { LegalPage, SiteSettings } from '../types/cms';

interface LegalPageProps {
  pageType: 'privacy' | 'cookies';
}

export function LegalPage({ pageType }: LegalPageProps) {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [legalPage, setLegalPage] = useState<LegalPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [settingsData, legalData] = await Promise.all([
          cmsService.getSiteSettings(),
          cmsService.getLegalPage(pageType),
        ]);

        setSettings(settingsData);
        setLegalPage(legalData);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [pageType]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-xl">{language === 'bg' ? 'Зареждане...' : 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header settings={settings} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <a
              href="/"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{language === 'bg' ? 'Назад към начало' : 'Back to Home'}</span>
            </a>

            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
              <div className="prose prose-blue max-w-none">
                {getLocalizedField(legalPage, 'content', language) ? (
                  <>
                    <h1>{getLocalizedField(legalPage, 'title', language) || (pageType === 'privacy' ? (language === 'bg' ? 'Политика за поверителност' : 'Privacy Policy') : (language === 'bg' ? 'Политика за бисквитки' : 'Cookies Policy'))}</h1>
                    <div dangerouslySetInnerHTML={{ __html: getLocalizedField(legalPage, 'content', language).replace(/\n/g, '<br />') }} />
                  </>
                ) : (
                  <div>
                    <h1>{pageType === 'privacy' ? (language === 'bg' ? 'Политика за поверителност' : 'Privacy Policy') : (language === 'bg' ? 'Политика за бисквитки' : 'Cookies Policy')}</h1>
                    <p>{language === 'bg' ? 'Съдържанието не е налично. Моля конфигурирайте тази страница в CMS.' : 'Content not available. Please configure this page in the CMS.'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </div>
  );
}
