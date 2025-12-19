import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cmsService } from '../services/cmsService';
import type { CookieConsentSettings } from '../types/cms';

const COOKIE_NAME = 'cookie_consent';

export function CookieConsent() {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<CookieConsentSettings | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await cmsService.getCookieConsentSettings();
      setSettings(data);

      if (data && data.is_enabled) {
        const consent = localStorage.getItem(COOKIE_NAME);
        if (!consent) {
          setIsVisible(true);
        }
      }
    } catch (error) {
      console.error('Error loading cookie consent settings:', error);
    }
  };

  const handleAccept = () => {
    localStorage.setItem(COOKIE_NAME, 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_NAME, 'declined');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || !settings) return null;

  const title = language === 'bg' ? settings.title_bg : settings.title_en;
  const message = language === 'bg' ? settings.message_bg : settings.message_en;
  const acceptText = language === 'bg' ? settings.accept_button_bg : settings.accept_button_en;
  const declineText = language === 'bg' ? settings.decline_button_bg : settings.decline_button_en;
  const learnMoreText = language === 'bg' ? settings.learn_more_text_bg : settings.learn_more_text_en;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t-2 border-gray-200 shadow-2xl animate-slide-up">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {message}{' '}
                  <a
                    href="/cookies"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    {learnMoreText}
                  </a>
                </p>
              </div>
              <button
                onClick={handleClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              {declineText}
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
            >
              {acceptText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
