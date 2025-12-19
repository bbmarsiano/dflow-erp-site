import { CheckCircle, ArrowRight } from 'lucide-react';
import type { ConsultingContent } from '../../types/cms';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocalizedField, getLocalizedArray } from '../../utils/language';

interface ConsultingSectionProps {
  content: ConsultingContent | null;
}

export function ConsultingSection({ content }: ConsultingSectionProps) {
  const { language } = useLanguage();
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="consulting" className="py-20 bg-gradient-to-br from-blue-900 to-teal-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {getLocalizedField(content, 'section_title', language) || (language === 'bg' ? 'Нуждаете се само от консултация или техническа спецификация?' : 'Need Only Consulting or a Technical Specification?')}
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              {getLocalizedField(content, 'description', language) || (language === 'bg' ? 'DFlow ERP може да действа и като консултантски партньор.' : 'DFlow ERP can also act purely as a consulting partner.')}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {getLocalizedArray(content, 'bullet_points', language).map((point, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <CheckCircle className="w-6 h-6 text-teal-300 flex-shrink-0 mt-0.5" />
                  <span className="text-blue-100">{point}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={scrollToContact}
                className="group inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>{getLocalizedField(content, 'cta_text', language) || (language === 'bg' ? 'Заявете Консултация' : 'Request Consultation')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
