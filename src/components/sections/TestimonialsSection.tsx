import { Quote } from 'lucide-react';
import type { Testimonial } from '../../types/cms';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocalizedField } from '../../utils/language';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const { language } = useLanguage();
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {language === 'bg' ? 'Доверено от иновативни бизнеси' : 'Trusted by Innovative Businesses'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'bg' ? 'Вижте какво казват нашите клиенти за работата с DFlow ERP' : 'See what our clients say about working with DFlow ERP'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 relative"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              <div className="absolute top-6 right-6 text-blue-200">
                <Quote className="w-12 h-12" />
              </div>

              <div className="relative z-10">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{getLocalizedField(testimonial, 'quote', language)}"
                </p>

                <div className="border-t border-gray-100 pt-4">
                  <p className="font-semibold text-gray-900">
                    {testimonial.client_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {testimonial.company}
                  </p>
                  {testimonial.sector && (
                    <p className="text-xs text-gray-500 mt-1">
                      {testimonial.sector}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
