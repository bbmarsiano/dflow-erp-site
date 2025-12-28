import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import type { Integration, IntegrationPopup } from '../../types/cms';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocalizedField, getLocalizedArray } from '../../utils/language';
import { Modal } from '../Modal';
import { cmsService } from '../../services/cmsService';

interface IntegrationsSectionProps {
  integrations: Integration[];
}

const INTEGRATION_KEY_MAP: Record<string, string> = {
  'API & System Integrations': 'integration_api_system',
  'API и системни интеграции': 'integration_api_system',
  'Financial Systems & Banks': 'integration_financial_systems',
  'Финансови системи и банки': 'integration_financial_systems',
  'eCommerce Platforms': 'integration_ecommerce',
  'eCommerce платформи': 'integration_ecommerce',
  'Analytics Dashboards': 'integration_analytics',
  'Analytics dashboards': 'integration_analytics',
  'Single Sign-On (SSO)': 'integration_sso',
  'Custom Integrations': 'integration_custom',
  'Custom интеграции': 'integration_custom',
};

export function IntegrationsSection({ integrations }: IntegrationsSectionProps) {
  const { language } = useLanguage();
  const [popups, setPopups] = useState<IntegrationPopup[]>([]);
  const [selectedPopup, setSelectedPopup] = useState<IntegrationPopup | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadPopups = async () => {
      try {
        const data = await cmsService.getIntegrationPopups();
        setPopups(data);
      } catch (error) {
        console.error('Error loading integration popups:', error);
      }
    };

    loadPopups();
  }, []);

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Puzzle;
    return <Icon className="w-8 h-8" />;
  };

  const handleCardClick = (integration: Integration) => {
    const title = getLocalizedField(integration, 'title', language);
    const popupKey = INTEGRATION_KEY_MAP[title];

    if (popupKey) {
      const popup = popups.find(p => p.popup_key === popupKey);
      if (popup) {
        setSelectedPopup(popup);
        setSelectedIntegration(integration);
        setIsModalOpen(true);
        return;
      } else if (popups.length === 0) {
        console.warn('Integration popups not loaded yet or failed to load');
      } else {
        console.warn(`Popup not found for key: ${popupKey}. Available popups:`, popups.map(p => p.popup_key));
      }
    }

    // Fallback: If title is empty or mapping fails, show modal with fallback message
    // This ensures modal opens even when integration title is empty/NULL after admin edit
    const fallbackPopup: IntegrationPopup = {
      id: `fallback-${integration.id}`,
      popup_key: 'integration_custom' as any,
      title_en: title || 'Integration Details',
      title_bg: title || 'Детайли за интеграция',
      body_en: 'Information about this integration is not available at the moment. Please contact us for more details.',
      body_bg: 'Информацията за тази интеграция не е налична в момента. Моля, свържете се с нас за повече детайли.',
      technical_details_en: [],
      technical_details_bg: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setSelectedPopup(fallbackPopup);
    setSelectedIntegration(integration);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPopup(null);
      setSelectedIntegration(null);
    }, 300);
  };

  return (
    <section id="integrations" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {language === 'bg' ? 'Интегрирайте DFlow ERP в вашата цифрова екосистема' : 'Integrate DFlow ERP into Your Digital Ecosystem'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'bg' ? 'Свързете безпроблемно с вашите съществуващи инструменти и платформи' : 'Seamlessly connect with your existing tools and platforms'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {integrations.map((integration, index) => (
            <button
              key={integration.id}
              onClick={() => handleCardClick(integration)}
              className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-lg cursor-pointer text-left w-full"
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  {getIcon(integration.icon_name)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getLocalizedField(integration, 'title', language)}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedPopup && selectedIntegration && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={
            (language === 'bg' ? selectedPopup.title_bg : selectedPopup.title_en) ||
            getLocalizedField(selectedIntegration, 'title', language) ||
            (language === 'bg' ? 'Детайли за интеграция' : 'Integration Details')
          }
          body={
            (language === 'bg' ? selectedPopup.body_bg : selectedPopup.body_en) ||
            (language === 'bg'
              ? 'Информацията за тази интеграция не е налична в момента.'
              : 'Information about this integration is not available at the moment.')
          }
          technicalDetails={getLocalizedArray(selectedPopup, 'technical_details', language)}
          technicalDetailsTitle={language === 'bg' ? 'Технически детайли:' : 'Technical details:'}
          icon={getIcon(selectedIntegration.icon_name)}
          variant="teal"
        />
      )}
    </section>
  );
}
