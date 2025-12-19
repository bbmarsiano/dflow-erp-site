import { ArrowRight, Play } from 'lucide-react';
import type { HeroContent } from '../../types/cms';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocalizedField } from '../../utils/language';

interface HeroSectionProps {
  content: HeroContent | null;
  bgImageUrl?: string;
  bgOpacity?: number;
}

export function HeroSection({ content, bgImageUrl, bgOpacity = 0.25 }: HeroSectionProps) {
  const { language } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {bgImageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bgImageUrl})`,
            opacity: bgOpacity,
            mixBlendMode: 'soft-light'
          }}
        />
      )}

      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20">
              {getLocalizedField(content, 'slogan', language) || (language === 'bg' ? 'ERP, изграден около вашия бизнес' : 'ERP, built around your business')}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up animation-delay-200">
            {getLocalizedField(content, 'headline', language) || (language === 'bg' ? 'Подобрете вашия работен процес' : 'Enhance your workflow')}
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
            {getLocalizedField(content, 'subheadline', language) || (language === 'bg' ? 'DFlow ERP предлага персонализирани ERP решения базирани на Odoo и Dolibarr.' : 'DFlow ERP delivers customized ERP solutions based on Odoo and Dolibarr.')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
            <button
              onClick={() => scrollToSection('contact')}
              className="group px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>{getLocalizedField(content, 'cta_primary_text', language) || (language === 'bg' ? 'Заявете Безплатна Консултация' : 'Request Free Consultation')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('packages')}
              className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 border border-white/20"
            >
              <Play className="w-5 h-5" />
              <span>{getLocalizedField(content, 'cta_secondary_text', language) || (language === 'bg' ? 'Вижте Демо' : 'See Demo')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
