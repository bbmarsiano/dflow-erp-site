import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import type { FeatureCard, WhyChoosePopup, SiteSettings, PlatformLogo } from '../../types/cms';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocalizedField, getLocalizedArray } from '../../utils/language';
import { Modal } from '../Modal';
import { cmsService } from '../../services/cmsService';

interface FeaturesSectionProps {
  features: FeatureCard[];
  settings: SiteSettings | null;
  platforms: PlatformLogo[];
}

const WHY_CHOOSE_KEY_MAP: Record<string, string> = {
  'Tailored Solutions': 'why_flexibility',
  'Персонализирани Решения': 'why_flexibility',
  'Flexible Architecture': 'why_cost',
  'Гъвкава Архитектура': 'why_cost',
  'Security & Compliance': 'why_expert',
  'Сигурност и Съответствие': 'why_expert',
  'Expert Support': 'why_control',
  'Експертна Поддръжка': 'why_control',
};

export function FeaturesSection({ features, settings, platforms }: FeaturesSectionProps) {
  const { language } = useLanguage();
  const [popups, setPopups] = useState<WhyChoosePopup[]>([]);
  const [selectedPopup, setSelectedPopup] = useState<WhyChoosePopup | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<FeatureCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadPopups = async () => {
      try {
        const data = await cmsService.getWhyChoosePopups();
        console.log('Loaded why choose popups:', data);
        setPopups(data);
      } catch (error) {
        console.error('Error loading why choose popups:', error);
      }
    };

    loadPopups();
  }, []);

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Zap;
    return <Icon className="w-8 h-8" />;
  };

  const handleCardClick = (feature: FeatureCard) => {
    const title = getLocalizedField(feature, 'title', language);
    const popupKey = WHY_CHOOSE_KEY_MAP[title];

    console.log('Card clicked:', {
      title,
      popupKey,
      availablePopups: popups.map(p => p.popup_key),
      foundPopup: popups.find(p => p.popup_key === popupKey)
    });

    if (popupKey) {
      const popup = popups.find(p => p.popup_key === popupKey);
      if (popup) {
        setSelectedPopup(popup);
        setSelectedFeature(feature);
        setIsModalOpen(true);
      } else {
        console.error('Popup not found for key:', popupKey);
      }
    } else {
      console.error('No popup key mapping found for title:', title);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPopup(null);
      setSelectedFeature(null);
    }, 300);
  };

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {language === 'bg' ? 'Защо да изберете DFlow ERP?' : 'Why Choose DFlow ERP?'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'bg' ? 'Гъвкави, сигурни и персонализирани ERP решения, които растат с вашия бизнес' : 'Flexible, secure, and tailored ERP solutions that grow with your business'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <button
              key={feature.id}
              onClick={() => handleCardClick(feature)}
              className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 cursor-pointer text-left w-full"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                {getIcon(feature.icon_name)}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {getLocalizedField(feature, 'title', language)}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {getLocalizedField(feature, 'description', language)}
              </p>
            </button>
          ))}
        </div>

        {settings?.show_integrations_section && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-4xl mx-auto">
            <p className="text-center text-sm font-medium text-gray-600 mb-6">
              {language === 'bg' ? 'Изградено върху утвърдени open-source ERP платформи' : 'Built on proven open-source ERP platforms'}
            </p>
            <div className="flex items-center justify-center space-x-12">
              {platforms.length > 0 ? (
                platforms.map((platform) => (
                  <div key={platform.id} className="flex items-center justify-center">
                    {platform.logo_url ? (
                      <img
                        src={platform.logo_url}
                        alt={getLocalizedField(platform, 'name', language) || platform.name_en}
                        className="h-12 w-auto object-contain hover:scale-110 transition-all duration-300 ease-out hover:drop-shadow-[0_0_10px_rgba(0,150,255,0.25)]"
                      />
                    ) : (
                      <div className="px-8 py-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg border-2 border-blue-200 hover:scale-110 transition-all duration-300 ease-out hover:drop-shadow-[0_0_10px_rgba(0,150,255,0.25)]">
                        <span className="text-xl font-bold text-blue-900">
                          {getLocalizedField(platform, 'name', language) || platform.name_en}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <>
                  <div className="px-8 py-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg border-2 border-blue-200 hover:scale-110 transition-all duration-300 ease-out hover:drop-shadow-[0_0_10px_rgba(0,150,255,0.25)]">
                    <span className="text-xl font-bold text-blue-900">Odoo</span>
                  </div>
                  <div className="px-8 py-4 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg border-2 border-teal-200 hover:scale-110 transition-all duration-300 ease-out hover:drop-shadow-[0_0_10px_rgba(0,150,255,0.25)]">
                    <span className="text-xl font-bold text-teal-900">Dolibarr</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedPopup && selectedFeature && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={language === 'bg' ? selectedPopup.title_bg : selectedPopup.title_en}
          body={language === 'bg' ? selectedPopup.body_bg : selectedPopup.body_en}
          technicalDetails={getLocalizedArray(selectedPopup, 'technical_details', language)}
          technicalDetailsTitle={language === 'bg' ? 'Технически детайли:' : 'Technical details:'}
          icon={getIcon(selectedFeature.icon_name)}
          variant="blue"
        />
      )}
    </section>
  );
}
