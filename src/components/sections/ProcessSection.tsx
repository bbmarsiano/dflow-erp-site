import { CheckCircle } from 'lucide-react';
import type { ProcessStep } from '../../types/cms';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocalizedField } from '../../utils/language';

interface ProcessSectionProps {
  steps: ProcessStep[];
}

export function ProcessSection({ steps }: ProcessSectionProps) {
  const { language } = useLanguage();
  return (
    <section id="process" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {language === 'bg' ? 'От идея до внедряване в 5 прости стъпки' : 'From Idea to Implementation in 5 Simple Steps'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'bg' ? 'Нашата доказана методология осигурява плавно внедряване на ERP' : 'Our proven methodology ensures smooth ERP deployment'}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-teal-500 hidden md:block"></div>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="relative flex items-start space-x-6 group"
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10 group-hover:scale-110 transition-transform">
                    {step.order_index}
                  </div>

                  <div className="flex-1 bg-gray-50 rounded-lg p-6 group-hover:bg-white group-hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                      {getLocalizedField(step, 'title', language)}
                      <CheckCircle className="w-5 h-5 ml-2 text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-gray-600">
                      {getLocalizedField(step, 'description', language)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
