import { useState } from 'react';
import { Check, ArrowRight, Server, Cloud, ExternalLink, Rocket, TrendingUp, Building2 } from 'lucide-react';
import type { Package } from '../../types/cms';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocalizedField, getLocalizedArray } from '../../utils/language';
import { PackageModal } from '../PackageModal';

interface PackagesSectionProps {
  packages: Package[];
}

export function PackagesSection({ packages }: PackagesSectionProps) {
  const { language } = useLanguage();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPackageIcon = (packageName: string, isFeatured: boolean) => {
    const name = packageName.toLowerCase();
    const iconClass = `w-5 h-5 ${isFeatured ? 'text-white' : 'text-sky-600'}`;

    if (name.includes('start')) return <Rocket className={iconClass} />;
    if (name.includes('grow')) return <TrendingUp className={iconClass} />;
    if (name.includes('enterprise')) return <Building2 className={iconClass} />;
    if (name.includes('premise')) return <Server className={iconClass} />;

    return <Cloud className={iconClass} />;
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewMore = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  return (
    <section id="packages" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {language === 'bg' ? 'Изберете вашия DFlow ERP пакет' : 'Choose Your DFlow ERP Package'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'bg' ? 'Всички пакети включват основни модули и мащабируема архитектура, която расте с вашия бизнес' : 'All packages include essential modules and a scalable architecture that grows with your business'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {packages.map((pkg, index) => {
            const isFeatured = pkg.is_featured || false;
            const isOnPremise = pkg.name.toLowerCase().includes('premise') || pkg.name_en?.toLowerCase().includes('premise');

            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 ${
                  isFeatured
                    ? 'bg-gradient-to-br from-blue-600 to-teal-600 text-white shadow-2xl scale-105'
                    : isOnPremise
                    ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 hover:shadow-[0_4px_30px_rgba(0,0,0,0.08)]'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-500 shadow-lg'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {isFeatured && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-2xl font-bold ${isFeatured ? 'text-white' : 'text-gray-900'}`}>
                      {getLocalizedField(pkg, 'name', language)}
                    </h3>
                    {getPackageIcon(getLocalizedField(pkg, 'name', language), isFeatured)}
                  </div>
                  <p className={`text-sm mb-4 ${isFeatured ? 'text-blue-100' : 'text-gray-600'}`}>
                    {getLocalizedField(pkg, 'description', language)}
                  </p>
                  {getLocalizedField(pkg, 'erp_platform', language) && (
                    <p className={`text-xs font-medium ${isFeatured ? 'text-blue-200' : 'text-gray-500'}`}>
                      {language === 'bg' ? 'Платформа' : 'Platform'}: {getLocalizedField(pkg, 'erp_platform', language)}
                    </p>
                  )}
                </div>

                {isOnPremise && getLocalizedField(pkg, 'deployment_options', language) && (
                  <div className="mb-6 p-4 bg-white/50 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      {language === 'bg' ? 'Възможности за внедряване:' : 'Deployment Options:'}
                    </p>
                    <div className="space-y-2 text-xs text-gray-600">
                      {getLocalizedField(pkg, 'deployment_options', language)
                        ?.split('\n')
                        .map((line, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            {line.includes('☁️') && <Cloud className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />}
                            {line.includes('🖥️') && <Server className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-600" />}
                            <span>{line.replace(/^[☁️🖥️]\s*/, '')}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className={`text-3xl font-bold ${isFeatured ? 'text-white' : 'text-gray-900'}`}>
                    {getLocalizedField(pkg, 'price_text', language)}
                  </div>
                  {isOnPremise && getLocalizedField(pkg, 'pricing_note', language) && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      {getLocalizedField(pkg, 'pricing_note', language)}
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  {getLocalizedArray(pkg, 'features', language).map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isFeatured ? 'text-teal-300' : 'text-teal-500'}`} />
                      <span className={`text-sm ${isFeatured ? 'text-blue-100' : 'text-gray-600'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {isOnPremise && getLocalizedField(pkg, 'technical_details', language) && (
                  <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs font-semibold text-gray-800 mb-3">
                      {language === 'bg' ? 'Технически предимства:' : 'Technical Details:'}
                    </p>
                    <div className="space-y-2 text-xs text-gray-700">
                      {getLocalizedField(pkg, 'technical_details', language)
                        ?.split('\n')
                        .filter(line => line.trim())
                        .map((line, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>{line.replace(/^[•]\s*/, '')}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {pkg.popup_enabled && (
                  <div className="mb-4 text-center">
                    <button
                      onClick={() => handleViewMore(pkg)}
                      className={`inline-flex items-center space-x-1 text-sm ${
                        isFeatured
                          ? 'text-white font-semibold hover:text-blue-100'
                          : 'text-blue-600 hover:text-blue-700'
                      } underline underline-offset-2 hover:underline-offset-4 transition-all duration-200 group`}
                    >
                      <span>{language === 'bg' ? 'Виж още възможности' : 'View more options'}</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                )}

                <button
                  onClick={scrollToContact}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group ${
                    isFeatured
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : isOnPremise
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-600 hover:to-sky-700 shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700'
                  }`}
                >
                  <span>
                    {isOnPremise && getLocalizedField(pkg, 'cta_label', language)
                      ? getLocalizedField(pkg, 'cta_label', language)
                      : getLocalizedField(pkg, 'cta_text', language)}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPackage && (
        <PackageModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={getLocalizedField(selectedPackage, 'popup_title', language) || ''}
          content={getLocalizedField(selectedPackage, 'popup_content', language) || ''}
          ctaLabel={getLocalizedField(selectedPackage, 'popup_cta_label', language)}
          onCtaClick={scrollToContact}
        />
      )}
    </section>
  );
}
