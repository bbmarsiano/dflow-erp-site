import { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import type { ContactContent } from '../../types/cms';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocalizedField } from '../../utils/language';
import { MathCaptcha } from '../MathCaptcha';
import { supabase } from '../../lib/supabase';

interface ContactSectionProps {
  content: ContactContent | null;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (container: string | HTMLElement, options: { sitekey: string }) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

export function ContactSection({ content }: ContactSectionProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState('');
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState<number | null>(null);
  const [captchaMode, setCaptchaMode] = useState<'testing' | 'google'>('testing');
  const [isMathCaptchaValid, setIsMathCaptchaValid] = useState(false);

  useEffect(() => {
    loadCaptchaSettings();
  }, []);

  useEffect(() => {
    if (captchaMode === 'google' && recaptchaSiteKey && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        try {
          const widgetId = window.grecaptcha.render('recaptcha-container', {
            sitekey: recaptchaSiteKey,
          });
          setRecaptchaWidgetId(widgetId);
        } catch (error) {
          console.error('Error rendering reCAPTCHA:', error);
        }
      });
    }
  }, [recaptchaSiteKey, captchaMode]);

  const loadCaptchaSettings = async () => {
    try {
      const settings = await cmsService.getSiteSettings();
      const mode = (settings.captcha_mode || 'testing') as 'testing' | 'google';
      setCaptchaMode(mode);

      if (mode === 'google') {
        const siteKey = await cmsService.getRecaptchaSiteKey();
        setRecaptchaSiteKey(siteKey);
      }
    } catch (error) {
      console.error('Error loading captcha settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      let recaptchaToken = '';

      if (captchaMode === 'testing') {
        if (!isMathCaptchaValid) {
          setSubmitStatus('error');
          setErrorMessage(language === 'bg' ? 'Моля, решете математическата задача' : 'Please solve the math problem');
          setIsSubmitting(false);
          return;
        }
        recaptchaToken = 'testing-mode-bypass';
      } else {
        recaptchaToken = window.grecaptcha.getResponse(recaptchaWidgetId || 0);

        if (!recaptchaToken) {
          setSubmitStatus('error');
          setErrorMessage(language === 'bg' ? 'Моля, потвърдете че не сте робот' : 'Please verify you are not a robot');
          setIsSubmitting(false);
          return;
        }
      }

      console.log('Submitting contact form...');
      console.log('Form data:', { ...formData, recaptchaToken: recaptchaToken.substring(0, 20) + '...' });

      const { error: insertError } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          message: formData.message,
          recaptcha_token: recaptchaToken,
        }]);

      if (insertError) {
        console.error('Database error:', insertError);
        throw new Error(insertError.message || 'Failed to save contact submission');
      }

      console.log('Contact submission saved successfully');

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      });

      if (captchaMode === 'testing') {
        setIsMathCaptchaValid(false);
      } else if (recaptchaWidgetId !== null) {
        window.grecaptcha.reset(recaptchaWidgetId);
      }

      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {getLocalizedField(content, 'headline', language) || (language === 'bg' ? 'Свържете се с нас' : 'Get in Touch')}
            </h2>
            <p className="text-lg text-gray-600">
              {getLocalizedField(content, 'subheadline', language) || (language === 'bg' ? 'Готови сме да обсъдим вашите нужди и да предложим подходящо решение' : 'Ready to discuss your needs and propose a suitable solution')}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'bg' ? 'Име *' : 'Name *'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'bg' ? 'Вашето име' : 'Your name'}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'bg' ? 'Имейл *' : 'Email *'}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'bg' ? 'your@email.com' : 'your@email.com'}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'bg' ? 'Телефон' : 'Phone'}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'bg' ? '+359 ...' : '+1 ...'}
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'bg' ? 'Компания' : 'Company'}
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'bg' ? 'Име на компанията' : 'Company name'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'bg' ? 'Съобщение *' : 'Message *'}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'bg' ? 'Опишете вашите нужди...' : 'Describe your needs...'}
                />
              </div>

              {captchaMode === 'testing' ? (
                <MathCaptcha
                  onChange={setIsMathCaptchaValid}
                  language={language}
                />
              ) : recaptchaSiteKey && (
                <div className="flex justify-center">
                  <div id="recaptcha-container"></div>
                </div>
              )}

              {submitStatus === 'success' && (
                <div className="flex items-center space-x-2 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
                  <CheckCircle size={20} />
                  <span>
                    {language === 'bg'
                      ? 'Съобщението е изпратено успешно! Ще се свържем с вас скоро.'
                      : 'Message sent successfully! We will get back to you soon.'}
                  </span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="flex items-center space-x-2 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
                  <AlertCircle size={20} />
                  <span>{errorMessage || (language === 'bg' ? 'Грешка при изпращане. Моля, опитайте отново.' : 'Error sending message. Please try again.')}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || (captchaMode === 'google' && !recaptchaSiteKey)}
                className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Send size={20} />
                <span>
                  {isSubmitting
                    ? (language === 'bg' ? 'Изпраща се...' : 'Sending...')
                    : (language === 'bg' ? 'Изпрати съобщение' : 'Send Message')}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
