/*
  # Fix Packages and Add Featured Field

  1. Changes to `packages` table
    - Add `is_featured` (boolean, default false)
  
  2. Package Fixes
    - Restore Enterprise package to original content
    - Update On-Premise package with correct data
    - Ensure 4 distinct packages: Start, Grow, Enterprise, On-Premise
*/

-- Add is_featured field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE packages ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
END $$;

-- Restore Enterprise package (id: 2ffe3e5f-8849-448d-8df8-f2f194f351b1)
UPDATE packages
SET
  name = 'Enterprise',
  name_en = 'Enterprise',
  name_bg = 'Enterprise',
  description = 'Designed for large-scale organizations with advanced process automation needs.',
  description_en = 'Includes everything from the Grow plan, plus full customization, API integrations, and enterprise-grade support.',
  description_bg = 'Включва всички функции от плана Grow, както и пълна персонализация, API интеграции и поддръжка на ниво Enterprise.',
  erp_platform_en = 'Odoo / Dolibarr',
  erp_platform_bg = 'Odoo / Dolibarr',
  features_en = '["Advanced automation", "Full customization", "API integrations", "Priority support", "Dedicated account manager", "Custom training"]'::jsonb,
  features_bg = '["Разширена автоматизация", "Пълна персонализация", "API интеграции", "Приоритетна поддръжка", "Личен мениджър", "Специализирано обучение"]'::jsonb,
  price_text = 'Contact us',
  price_text_en = 'Contact us',
  price_text_bg = 'По запитване',
  cta_text_en = 'Request Enterprise Demo',
  cta_text_bg = 'Заяви демонстрация',
  is_featured = true,
  deployment_options_en = NULL,
  deployment_options_bg = NULL,
  technical_details_en = NULL,
  technical_details_bg = NULL,
  cta_label_en = NULL,
  cta_label_bg = NULL,
  pricing_note_en = NULL,
  pricing_note_bg = NULL,
  popup_enabled = false,
  popup_title_en = NULL,
  popup_title_bg = NULL,
  popup_content_en = NULL,
  popup_content_bg = NULL,
  popup_cta_label_en = NULL,
  popup_cta_label_bg = NULL,
  order_index = 3
WHERE id = '2ffe3e5f-8849-448d-8df8-f2f194f351b1';

-- Update the 4th package to be the proper On-Premise Solution
UPDATE packages
SET
  name = 'On-Premise Solution',
  name_en = 'On-Premise Solution',
  name_bg = 'Локално решение (On-Premise)',
  description = 'Your ERP, your infrastructure.',
  description_en = 'For organizations requiring full data control, compliance, or integration within their internal network, DFlow ERP can be installed and managed locally. You get all the flexibility of DFlow ERP — but fully under your control.',
  description_bg = 'За организации, които изискват пълен контрол върху данните, сигурност и интеграция със собствена ИТ инфраструктура, DFlow ERP може да бъде внедрено локално. Получавате всички предимства на DFlow ERP — но изцяло под ваш контрол.',
  erp_platform_en = 'Odoo / Dolibarr',
  erp_platform_bg = 'Odoo / Dolibarr',
  features_en = '["Full data sovereignty", "Custom security policies", "SSO / LDAP integration", "Offline operation", "Local backups", "Managed maintenance (optional)"]'::jsonb,
  features_bg = '["Пълен контрол върху данните", "Специализирани политики за сигурност", "SSO / LDAP интеграция", "Офлайн работа", "Локални резервни копия", "Управлявана поддръжка (по избор)"]'::jsonb,
  price_text = 'On Request',
  price_text_en = 'On Request',
  price_text_bg = 'По запитване',
  cta_text_en = 'Get Quote',
  cta_text_bg = 'Изпрати запитване',
  deployment_options_en = '☁️ Cloud-based (default) — hosted and maintained by our team for maximum convenience.
🖥️ On-Premise — installed on your servers or private cloud, fully isolated and managed by your IT team or ours.',
  deployment_options_bg = '☁️ Облачна (по подразбиране) — хоствана и поддържана от нашия екип, без нужда от техническа намеса.
🖥️ Локална (On-Premise) — инсталация върху ваши сървъри или частен облак, изцяло изолирана и управлявана от вашия ИТ екип или от нас.',
  technical_details_en = '• Full data sovereignty and access control
• Integration with internal authentication systems (SSO / LDAP)
• Custom security policies and audit trails
• Offline operation and local backups
• Optional managed maintenance contract',
  technical_details_bg = '• Пълен контрол и достъп до всички данни
• Интеграция с вътрешни системи за идентификация (SSO / LDAP)
• Специализирани политики за сигурност и одит
• Работа в офлайн режим и локални резервни копия
• Възможност за договор за управлявана поддръжка',
  cta_label_en = 'Request On-Premise Quote',
  cta_label_bg = 'Изпрати запитване',
  pricing_note_en = 'Price available only upon request — based on scope, infrastructure, and configuration.',
  pricing_note_bg = 'Предлага се само по запитване — според спецификацията и инфраструктурата.',
  popup_enabled = true,
  popup_title_en = 'On-Premise Deployment — Enterprise Control',
  popup_title_bg = 'Локално внедряване — пълен контрол за предприятията',
  popup_content_en = '<div style="line-height: 1.8;">
<p style="font-size: 1.1rem; color: #1f2937; margin-bottom: 1.5rem;">
For organizations requiring <strong>full data control</strong>, compliance, or integration within their internal network, DFlow ERP can be installed and managed locally.
</p>

<div style="background: #f3f4f6; padding: 1.5rem; border-radius: 0.75rem; margin-bottom: 1.5rem;">
<h3 style="color: #1f2937; font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem;">🖥️ On-Premise Benefits:</h3>
<ul style="list-style: none; padding: 0; margin: 0;">
  <li style="margin-bottom: 0.75rem;">✓ <strong>Complete Data Sovereignty</strong> — All data stays on your infrastructure</li>
  <li style="margin-bottom: 0.75rem;">✓ <strong>Custom Security Policies</strong> — Implement your own security standards and audit trails</li>
  <li style="margin-bottom: 0.75rem;">✓ <strong>SSO / LDAP Integration</strong> — Connect with your existing authentication systems</li>
  <li style="margin-bottom: 0.75rem;">✓ <strong>Offline Operation</strong> — Work without internet connectivity</li>
  <li style="margin-bottom: 0.75rem;">✓ <strong>Local Backups</strong> — Full control over your backup strategy</li>
</ul>
</div>

<p style="color: #4b5563; font-style: italic; margin-top: 1.5rem;">
Ideal for enterprises and organizations with strict compliance or data protection requirements (GDPR, HIPAA, industry-specific regulations).
</p>
</div>',
  popup_content_bg = '<div style="line-height: 1.8;">
<p style="font-size: 1.1rem; color: #1f2937; margin-bottom: 1.5rem;">
За организации, които изискват <strong>пълен контрол върху данните</strong>, съответствие със стандарти или интеграция в собствена мрежа, DFlow ERP може да бъде инсталирано и управлявано локално.
</p>

<div style="background: #f3f4f6; padding: 1.5rem; border-radius: 0.75rem; margin-bottom: 1.5rem;">
<h3 style="color: #1f2937; font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem;">🖥️ Предимства на локалното решение:</h3>
<ul style="list-style: none; padding: 0; margin: 0;">
  <li style="margin-bottom: 0.75rem;">✓ <strong>Пълен контрол над данните</strong> — Всички данни остават във вашата инфраструктура</li>
  <li style="margin-bottom: 0.75rem;">✓ <strong>Персонализирани политики за сигурност</strong> — Прилагайте собствени стандарти и одит</li>
  <li style="margin-bottom: 0.75rem;">✓ <strong>SSO / LDAP интеграция</strong> — Свързване със съществуващи системи за идентификация</li>
  <li style="margin-bottom: 0.75rem;">✓ <strong>Офлайн работа</strong> — Функционалност без интернет връзка</li>
  <li style="margin-bottom: 0.75rem;">✓ <strong>Локални резервни копия</strong> — Пълен контрол над стратегията за архивиране</li>
</ul>
</div>

<p style="color: #4b5563; font-style: italic; margin-top: 1.5rem;">
Подходящо за предприятия и организации с високи изисквания за съответствие и защита на данните (GDPR, HIPAA, индустриални регулации).
</p>
</div>',
  popup_cta_label_en = 'Request On-Premise Quote',
  popup_cta_label_bg = 'Изпрати запитване',
  is_featured = false,
  order_index = 4
WHERE id = '0c1faa5f-66f9-41e3-bc27-a254be5adef7';