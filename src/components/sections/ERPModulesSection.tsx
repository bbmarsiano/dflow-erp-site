import { Layers } from 'lucide-react';
import type { ERPModule } from '../../types/cms';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocalizedField } from '../../utils/language';

interface ERPModulesSectionProps {
  modules: ERPModule[];
}

export function ERPModulesSection({ modules }: ERPModulesSectionProps) {
  const { language } = useLanguage();

  if (modules.length === 0) {
    return null;
  }

  const titles = {
    en: {
      title: 'Explore DFlow ERP Modules',
      subtitle: 'Take a closer look at the core modules that power your workflows.'
    },
    bg: {
      title: 'Разгледайте модулите на DFlow ERP',
      subtitle: 'Вижте основните модули, които движат вашите процеси.'
    }
  };

  const text = titles[language];

  const getPlatformBadgeColors = (platform: string | undefined) => {
    if (!platform) return '';

    const normalized = platform.toLowerCase();
    if (normalized.includes('odoo')) {
      return 'bg-fuchsia-50 text-fuchsia-700';
    } else if (normalized.includes('dolibarr')) {
      return 'bg-sky-50 text-sky-700';
    } else if (normalized.includes('both')) {
      return 'bg-emerald-50 text-emerald-700';
    }
    return 'bg-blue-50 text-blue-700';
  };

  return (
    <section id="erp-modules" className="py-10 md:py-16 bg-gradient-to-b from-slate-50/60 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
            {text.title}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-teal-600 mx-auto rounded-full mb-4"></div>
          <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {text.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {modules.map((module, index) => (
            <div
              key={module.id}
              className="group bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] border border-slate-100 overflow-hidden hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)] transition-all duration-300 ease-out"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards',
                opacity: 0
              }}
            >
              {module.screenshot_url ? (
                <div className="h-32 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                  <img
                    src={module.screenshot_url}
                    alt={getLocalizedField(module, 'title', language) || ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="h-32 w-full bg-gradient-to-br from-blue-50 via-teal-50 to-slate-50 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    <Layers className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              )}

              <div className="p-5 md:p-6">
                <div className="mb-3">
                  <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-2 leading-snug">
                    {getLocalizedField(module, 'title', language)}
                  </h3>
                  {module.platform && (
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getPlatformBadgeColors(module.platform)}`}>
                      {module.platform}
                    </span>
                  )}
                </div>

                <p className="text-sm md:text-[0.95rem] text-slate-600 leading-relaxed line-clamp-4">
                  {getLocalizedField(module, 'description', language)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
