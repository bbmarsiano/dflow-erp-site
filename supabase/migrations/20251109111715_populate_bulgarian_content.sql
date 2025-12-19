/*
  # Populate Bulgarian Content

  ## Overview
  This migration populates the database with Bulgarian translations for all content.
  Bulgarian is set as the default language.

  ## Changes
  - Update hero content with Bulgarian translations
  - Update feature cards with Bulgarian translations
  - Update process steps with Bulgarian translations
  - Update packages with Bulgarian translations
  - Update integrations with Bulgarian translations
  - Update consulting content with Bulgarian translations
  - Update testimonials with Bulgarian translations
  - Update contact content with Bulgarian translations
  - Update site settings with Bulgarian translations
*/

-- Update hero content
UPDATE hero_content SET
  headline_bg = 'Подобрете вашия работен процес',
  headline_en = 'Enhance your workflow',
  subheadline_bg = 'DFlow ERP предлага персонализирани ERP решения базирани на Odoo и Dolibarr. Ние адаптираме, конфигурираме и интегрираме системи, които отговарят на вашите работни процеси и амбиции за растеж.',
  subheadline_en = 'DFlow ERP delivers customized ERP solutions based on Odoo and Dolibarr. We tailor, configure, and integrate systems that match your workflows and growth ambitions.',
  slogan_bg = 'ERP, изграден около вашия бизнес',
  slogan_en = 'ERP, built around your business',
  cta_primary_text_bg = 'Заявете Безплатна Консултация',
  cta_primary_text_en = 'Request Free Consultation',
  cta_secondary_text_bg = 'Вижте Демо',
  cta_secondary_text_en = 'See Demo'
WHERE id IS NOT NULL;

-- Update site settings
UPDATE site_settings SET
  company_name_bg = 'Balkan Invest Consult',
  company_name_en = 'Balkan Invest Consult',
  company_address_bg = '',
  company_address_en = '',
  meta_title_bg = 'DFlow ERP - Персонализирани ERP Решения',
  meta_title_en = 'DFlow ERP - Tailored ERP Solutions',
  meta_description_bg = 'Персонализирани ERP решения базирани на Odoo и Dolibarr',
  meta_description_en = 'Customized ERP solutions based on Odoo and Dolibarr'
WHERE id IS NOT NULL;

-- Update consulting content
UPDATE consulting_content SET
  section_title_bg = 'Нуждаете се само от консултация или техническа спецификация?',
  section_title_en = 'Need Only Consulting or a Technical Specification?',
  description_bg = 'DFlow ERP може да действа и като консултантски партньор.',
  description_en = 'DFlow ERP can also act purely as a consulting partner.',
  cta_text_bg = 'Заявете Консултация',
  cta_text_en = 'Request Consultation'
WHERE id IS NOT NULL;

-- Update contact content
UPDATE contact_content SET
  section_title_bg = 'Нека обсъдим вашето ERP решение',
  section_title_en = 'Let''s Discuss Your ERP Solution',
  subheadline_bg = 'Разкажете ни за вашия бизнес',
  subheadline_en = 'Tell us about your business',
  success_message_bg = 'Благодарим! Ще се свържем с вас скоро.',
  success_message_en = 'Thank you! We will get back to you soon.'
WHERE id IS NOT NULL;

-- Insert sample feature cards if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM feature_cards LIMIT 1) THEN
    INSERT INTO feature_cards (title_bg, title_en, description_bg, description_en, icon_name, order_index) VALUES
    ('Персонализирани Решения', 'Tailored Solutions', 'Всяка ERP система е конфигурирана специално за вашия бизнес модел', 'Every ERP system is configured specifically for your business model', 'Zap', 1),
    ('Гъвкава Архитектура', 'Flexible Architecture', 'Лесно мащабируеми решения, които растат заедно с вас', 'Easily scalable solutions that grow with you', 'Layers', 2),
    ('Сигурност и Съответствие', 'Security & Compliance', 'Пълно съответствие с GDPR и индустриални стандарти', 'Full GDPR compliance and industry standards', 'Shield', 3),
    ('Експертна Поддръжка', 'Expert Support', '24/7 техническа поддръжка и консултации', '24/7 technical support and consultations', 'Users', 4);
  END IF;
END $$;

-- Insert sample process steps if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM process_steps LIMIT 1) THEN
    INSERT INTO process_steps (title_bg, title_en, description_bg, description_en, order_index) VALUES
    ('Консултация и Анализ', 'Consultation & Analysis', 'Разбираме вашите бизнес процеси и изисквания', 'We understand your business processes and requirements', 1),
    ('Планиране и Дизайн', 'Planning & Design', 'Създаваме детайлен план за внедряване', 'We create a detailed implementation plan', 2),
    ('Конфигурация', 'Configuration', 'Персонализираме ERP системата според вашите нужди', 'We customize the ERP system to your needs', 3),
    ('Тестване', 'Testing', 'Проверяваме всички функционалности', 'We verify all functionalities', 4),
    ('Обучение и Стартиране', 'Training & Launch', 'Обучаваме екипа ви и стартираме системата', 'We train your team and launch the system', 5);
  END IF;
END $$;

-- Insert sample packages if they don't exist  
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM packages LIMIT 1) THEN
    INSERT INTO packages (name_bg, name_en, description_bg, description_en, erp_platform_bg, erp_platform_en, features_bg, features_en, price_text_bg, price_text_en, cta_text_bg, cta_text_en, order_index) VALUES
    ('Стартър', 'Starter', 'Перфектен за малки фирми', 'Perfect for small businesses', 'Dolibarr', 'Dolibarr', '["Базови модули", "5 потребителя", "Облачен хостинг", "Имейл поддръжка"]'::jsonb, '["Basic modules", "5 users", "Cloud hosting", "Email support"]'::jsonb, 'От €50/месец', 'From €50/month', 'Започнете', 'Get Started', 1),
    ('Бизнес', 'Business', 'За растящи компании', 'For growing companies', 'Odoo', 'Odoo', '["Разширени модули", "20 потребителя", "Персонализации", "Приоритетна поддръжка"]'::jsonb, '["Advanced modules", "20 users", "Customizations", "Priority support"]'::jsonb, 'От €200/месец', 'From €200/month', 'Започнете', 'Get Started', 2),
    ('Ентърпрайз', 'Enterprise', 'Пълно ERP решение', 'Complete ERP solution', 'Odoo', 'Odoo', '["Всички модули", "Неограничени потребители", "Пълна персонализация", "24/7 поддръжка"]'::jsonb, '["All modules", "Unlimited users", "Full customization", "24/7 support"]'::jsonb, 'Индивидуална оферта', 'Custom quote', 'Свържете се', 'Contact us', 3),
    ('On-Premise', 'On-Premise', 'Локално внедряване', 'Local deployment', 'Odoo/Dolibarr', 'Odoo/Dolibarr', '["Собствен сървър", "Пълен контрол", "Максимална сигурност", "Професионална поддръжка"]'::jsonb, '["Own server", "Full control", "Maximum security", "Professional support"]'::jsonb, 'Индивидуална оферта', 'Custom quote', 'Свържете се', 'Contact us', 4);
  END IF;
END $$;

-- Insert sample integrations if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM integrations LIMIT 1) THEN
    INSERT INTO integrations (title_bg, title_en, icon_name, order_index) VALUES
    ('Счетоводство', 'Accounting', 'Calculator', 1),
    ('E-commerce', 'E-commerce', 'ShoppingCart', 2),
    ('CRM', 'CRM', 'Users', 3),
    ('Склад', 'Warehouse', 'Package', 4),
    ('HR', 'HR', 'UserCheck', 5),
    ('Банкови Услуги', 'Banking', 'CreditCard', 6);
  END IF;
END $$;

-- Insert sample testimonials if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1) THEN
    INSERT INTO testimonials (client_name, company, sector, quote_bg, quote_en, order_index) VALUES
    ('Иван Петров', 'Tech Solutions Ltd', 'IT Services', 'DFlow ERP трансформира нашите бизнес процеси. Системата е гъвкава и лесна за използване.', 'DFlow ERP transformed our business processes. The system is flexible and easy to use.', 1),
    ('Мария Георгиева', 'Green Foods', 'Retail', 'Отличен екип и професионално обслужване. Препоръчваме топло!', 'Excellent team and professional service. Highly recommended!', 2),
    ('Георги Иванов', 'Manufacturing Pro', 'Manufacturing', 'Внедряването беше гладко и екипът винаги е на разположение за помощ.', 'The implementation was smooth and the team is always available for help.', 3);
  END IF;
END $$;