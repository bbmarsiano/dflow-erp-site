/*
  # Populate Popup Content

  ## Overview
  This migration populates the integration_popups and why_choose_popups tables with default bilingual content
  as specified in the requirements.

  ## Content
  - 6 integration popups (API systems, financial, eCommerce, analytics, SSO, custom)
  - 4 why choose popups (flexibility, cost, expert, control)
  - All content in both English and Bulgarian
*/

-- Insert integration popups
INSERT INTO integration_popups (popup_key, title_en, title_bg, body_en, body_bg, technical_details_en, technical_details_bg) VALUES

-- API & System Integrations
('integration_api_system',
 'API & System Integrations — connect DFlow ERP with your existing software',
 'API и системни интеграции — свързваме DFlow ERP с останалия ви софтуер',
 'DFlow ERP uses the standard RESTful APIs of Odoo and Dolibarr to build reliable two-way integrations between your ERP and external systems – CRM, eCommerce, manufacturing, logistics or internal tools.',
 'DFlow ERP използва стандартните RESTful API интерфейси на Odoo и Dolibarr, за да изгражда надеждни двупосочни връзки между ERP и външни системи – CRM, онлайн магазини, производствени, логистични или вътрешни приложения.',
 '["REST/JSON APIs with bearer token or OAuth 2.0 authentication", "Optional webhooks for near real-time synchronization", "Ability to integrate via middleware (Node.js / Python FastAPI / n8n / Make.com)", "Request logging and retry mechanism for improved stability", "Support for bidirectional data flows (read/write) with mapping and normalization"]'::jsonb,
 '["REST/JSON API с bearer token или OAuth 2.0 удостоверяване", "Възможност за webhooks за синхронизация в почти реално време", "Интеграция чрез middleware (Node.js / Python FastAPI / n8n / Make.com)", "Логове на заявките и retry механизъм при грешка", "Поддръжка на двупосочни потоци (read/write) с mapping и нормализиране на данните"]'::jsonb
),

-- Financial Systems & Banks
('integration_financial_systems',
 'Financial Systems & Banks — automated payments and bank flows',
 'Финансови системи и банки — автоматизирани плащания и банкови потоци',
 'We connect DFlow ERP to banks and financial systems to reduce manual work and errors. Using Odoo and Dolibarr banking modules or custom connectors, we automate bank statement imports and reconciliation.',
 'Свързваме DFlow ERP с банки и финансови системи, за да намалим ръчната работа и грешките. Използваме банковите модули на Odoo и Dolibarr или разработваме конектори към локални банки и счетоводни системи.',
 '["Import of bank transactions via CSV, XML SEPA or Open Banking APIs", "Automatic reconciliation of payments to invoices and customers", "Two-way integration with accounting or ERP systems where required", "Scheduled jobs for daily bank statement synchronization", "Custom validation and approval rules for payments"]'::jsonb,
 '["Импорт на банкови движения през CSV, XML SEPA или Open Banking API", "Автоматично осчетоводяване спрямо фактури и клиенти", "Двупосочна интеграция със счетоводни или ERP системи при нужда", "Планирани задачи за дневен синхрон на банковите извлечения", "Custom правила за валидиране и одобрение на плащанията"]'::jsonb
),

-- eCommerce Platforms
('integration_ecommerce',
 'eCommerce Platforms — keep your store and ERP in sync',
 'eCommerce платформи — синхронизация между онлайн магазина и ERP',
 'We connect your ERP to your online store so products, stock levels and orders stay in sync. We support WooCommerce, Shopify, Magento, PrestaShop and other major platforms.',
 'Свързваме ERP системата с вашия онлайн магазин, така че продукти, наличности и поръчки да са винаги актуални. Поддържаме WooCommerce, Shopify, Magento, PrestaShop и други популярни платформи.',
 '["REST / GraphQL integrations with eCommerce platforms", "Webhooks for new orders and inventory changes", "JSON-based mapping for products, SKUs, prices and attributes", "Automatic invoice creation and order status updates in ERP", "Queue-based processing for high order volumes"]'::jsonb,
 '["REST / GraphQL интеграции с eCommerce платформи", "Webhooks при нови поръчки и промени в инвентара", "JSON mapping за продукти, SKU, цени и атрибути", "Автоматично генериране на фактури и обновяване на статусите", "Queue-базирана обработка при голям обем поръчки"]'::jsonb
),

-- Analytics Dashboards
('integration_analytics',
 'Analytics Dashboards — from data to decisions',
 'Analytics dashboards — от данни към решения',
 'DFlow ERP prepares your Odoo or Dolibarr data for BI tools like Power BI, Metabase or Grafana. You get real-time dashboards instead of static reports.',
 'DFlow ERP подготвя данните от Odoo или Dolibarr за BI инструменти като Power BI, Metabase или Grafana, така че да работите с динамични dashboards, а не със статични отчети.',
 '["Read-only API endpoints or SQL views for BI integration", "Connectors for Power BI, Metabase, Grafana or Google Data Studio", "Automatic refresh via scheduled jobs or event triggers", "Exports in JSON, CSV, XLSX or direct database connections", "Role-based access to KPIs and dashboards"]'::jsonb,
 '["Read-only API endpoints или SQL views за BI", "Интеграции с Power BI, Metabase, Grafana или Google Data Studio", "Автоматично обновяване чрез cron или event triggers", "Експорт във формат JSON, CSV, XLSX или директна връзка към базата", "Достъп до KPI и dashboards според роли и права"]'::jsonb
),

-- Single Sign-On (SSO)
('integration_sso',
 'Single Sign-On (SSO) — one login for all your systems',
 'Single Sign-On (SSO) — един акаунт за всички системи',
 'For organizations with strict security requirements, we integrate DFlow ERP with your identity provider so users log in once and access all systems they need.',
 'За организации със строги изисквания за сигурност интегрираме DFlow ERP с вашия identity provider, така че потребителите да използват един акаунт за достъп до всички системи.',
 '["Support for OAuth 2.0, OpenID Connect and SAML 2.0", "Integrations with Azure AD, Google Workspace, Keycloak, Okta", "Single Sign-On and Single Logout scenarios", "Role and group mapping into ERP roles/permissions", "Optional network restrictions (VPN, IP whitelisting) for admin endpoints"]'::jsonb,
 '["Поддръжка на OAuth 2.0, OpenID Connect и SAML 2.0", "Интеграции с Azure AD, Google Workspace, Keycloak, Okta", "Single Sign-On и Single Logout сценарии", "Мапване на роли и групи към правата в ERP", "Възможност за мрежови ограничения (VPN, IP allow list) за admin достъп"]'::jsonb
),

-- Custom Integrations
('integration_custom',
 'Custom Integrations — when standard connectors are not enough',
 'Custom интеграции — когато стандартните конектори не са достатъчни',
 'When off-the-shelf connectors are not sufficient, we design and implement bespoke integrations for Odoo and Dolibarr, tailored to your architecture and roadmap.',
 'Когато готовите конектори не са достатъчни, проектираме и разработваме специфични интеграции за Odoo и Dolibarr, съобразени с вашата архитектура и дългосрочни планове.',
 '["Custom Odoo modules (Python) and Dolibarr addons (PHP)", "External REST API endpoints and microservices (FastAPI / Express.js)", "Message queues (RabbitMQ, Redis Streams) for large-scale integrations", "Event-driven architecture for complex synchronization scenarios", "Versioning, logging and rollback strategies for safe deployments"]'::jsonb,
 '["Custom модули за Odoo (Python) и addons за Dolibarr (PHP)", "Външни REST API endpoints и microservices (FastAPI / Express.js)", "Използване на message queues (RabbitMQ, Redis Streams) при големи интеграции", "Event-driven архитектура за сложни сценарии на синхронизация", "Версиониране, логове и стратегии за rollback при внедряване"]'::jsonb
)

ON CONFLICT (popup_key) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_bg = EXCLUDED.title_bg,
  body_en = EXCLUDED.body_en,
  body_bg = EXCLUDED.body_bg,
  technical_details_en = EXCLUDED.technical_details_en,
  technical_details_bg = EXCLUDED.technical_details_bg,
  updated_at = now();

-- Insert why choose popups
INSERT INTO why_choose_popups (popup_key, title_en, title_bg, body_en, body_bg, technical_details_en, technical_details_bg) VALUES

-- Flexibility & Adaptation
('why_flexibility',
 'Flexibility & Adaptation — choose the ERP that fits your processes',
 'Гъвкавост и адаптивност — избираме ERP според вашите процеси',
 'DFlow ERP does not force a single product on every client. We start from your processes and choose the right platform — Odoo or Dolibarr — then configure only the modules you actually need.',
 'DFlow ERP не налага едно и също решение на всеки клиент. Тръгваме от вашите процеси и избираме подходящата платформа — Odoo или Dolibarr, а след това конфигурираме само модулите, които са ви необходими.',
 '["Modular architecture with separate apps (CRM, Sales, Inventory, Manufacturing, HR, etc.)", "Extensible via custom modules: Python add-ons for Odoo, PHP modules for Dolibarr", "REST/JSON APIs for connecting external systems and adding new features over time", "Support for multi-company, multi-currency and multi-warehouse setups", "Configuration managed in staging/production environments with safe changes and rollbacks"]'::jsonb,
 '["Модулна архитектура с отделни приложения (CRM, Продажби, Склад, Производство, HR и др.)", "Разширяемост чрез custom модули: Python add-ons за Odoo, PHP модули за Dolibarr", "REST/JSON API за интеграция с външни системи и добавяне на нови функционалности във времето", "Поддръжка на multi-company, multi-currency и множество складове", "Конфигурации в отделна среда (staging → production) с възможност за контрол и rollback"]'::jsonb
),

-- Optimized Cost
('why_cost',
 'Optimized Cost — transparent pricing and controlled TCO',
 'Оптимизирана цена — прозрачно ценообразуване и контрол върху TCO',
 'With DFlow ERP you avoid oversized, expensive ERP projects. By using open-source platforms like Odoo and Dolibarr, we balance license, infrastructure and customization costs.',
 'С DFlow ERP избягвате прекалено големи и скъпи ERP проекти. Използвайки open-source платформи като Odoo и Dolibarr, балансираме разходите за лиценз, инфраструктура и доработки.',
 '["Use of open-source editions when possible to reduce licensing costs", "Option to mix cloud hosting with on-premise components", "Distinct separation between configuration (no-code/low-code) and custom development", "Transparent estimation of implementation effort per module and integration", "Ability to start small and add modules later without redoing the entire system"]'::jsonb,
 '["Използване на open-source издания, когато е възможно, за минимизиране на license разходите", "Възможност за комбиниране на cloud и on-premise компоненти", "Ясно разграничение между конфигурация (no-code/low-code) и custom разработка", "Прозрачна оценка на усилието по внедряване за всеки модул и интеграция", "Възможност да стартирате с по-малък пакет и да надграждате без пълно пренаписване"]'::jsonb
),

-- Expert Implementation
('why_expert',
 'Expert Implementation — from discovery to successful go-live',
 'Експертно внедряване — от анализ до успешно въвеждане',
 'DFlow ERP is not just a software installation. We map your processes, align them with Odoo or Dolibarr, and implement the solution in controlled phases with testing and training.',
 'DFlow ERP не е просто инсталация на софтуер. Описваме процесите ви, съпоставяме ги с възможностите на Odoo или Dolibarr и внедряваме решението на фази – с тестове, обучение и реално управление на промяната.',
 '["Structured discovery workshops and process mapping (including BPMN diagrams if needed)", "GAP analysis between current processes and standard ERP features", "Use of staging environments for safe testing before production", "Automated or semi-automated data migration from legacy systems (CSV, Excel, databases)", "Version control for configuration and custom modules using Git", "Clear rollout plan: pilot phase, training, progressive go-live"]'::jsonb,
 '["Структурирани workshops и process mapping (вкл. BPMN диаграми при нужда)", "GAP анализ между текущите процеси и стандартната ERP функционалност", "Staging среда за безопасни тестове преди продукционен rollout", "Автоматизирана или полу-автоматизирана миграция на данни от стари системи (CSV, Excel, бази)", "Version control за конфигурации и custom модули (Git)", "Ясен план за внедряване: пилотна фаза, обучение, поетапен go-live"]'::jsonb
),

-- Full Control & Security
('why_control',
 'Full Control & Security — your data, your rules',
 'Пълен контрол и сигурност — вашите данни, вашите правила',
 'For many organizations ERP is a critical system. DFlow ERP gives you a choice: cloud, on-premise or hybrid. You stay in control of where your data lives and who can access it.',
 'За много организации ERP е критична система. DFlow ERP ви дава избор: cloud, on-premise или хибрид. Вие контролирате къде са данните, кой има достъп и как се проследяват промените.',
 '["Choice between managed cloud, self-hosted on-premise or hybrid deployments", "Role-based access control (RBAC) and granular permissions", "SSL/TLS encryption and secure API endpoints with audit logs", "Backup and recovery strategies, including scheduled backups and test restores", "Configurations tailored to regulations (e.g. GDPR, data retention policies)", "Optional network-level restrictions (VPN, IP allow lists)"]'::jsonb,
 '["Избор между управляван cloud, собствен on-premise или хибридна архитектура", "Ролеви модел за достъп (RBAC) и детайлни права по потребител и група", "SSL/TLS криптиране и защитени API endpoints с audit logs", "Стратегия за backup и recovery, включително регулярни тестови възстановявания", "Конфигурация, съобразена с регулации (GDPR, политики за съхранение на данни)", "По избор – мрежови ограничения (VPN, IP allow list) за администраторски достъп"]'::jsonb
)

ON CONFLICT (popup_key) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_bg = EXCLUDED.title_bg,
  body_en = EXCLUDED.body_en,
  body_bg = EXCLUDED.body_bg,
  technical_details_en = EXCLUDED.technical_details_en,
  technical_details_bg = EXCLUDED.technical_details_bg,
  updated_at = now();