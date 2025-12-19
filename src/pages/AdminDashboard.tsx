import { useState, useEffect } from 'react';
import {
  LogOut,
  Home,
  Settings,
  FileText,
  Package,
  Users,
  Mail,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Menu,
} from 'lucide-react';
import { authService } from '../services/authService';
import { cmsService } from '../services/cmsService';
import { adminService } from '../services/adminService';
import { FeaturesEditor } from '../components/admin/FeaturesEditor';
import { ProcessEditor } from '../components/admin/ProcessEditor';
import { IntegrationsEditor } from '../components/admin/IntegrationsEditor';
import { ConsultingEditor } from '../components/admin/ConsultingEditor';
import { TestimonialsEditor } from '../components/admin/TestimonialsEditor';
import { CustomPagesEditor } from '../components/admin/CustomPagesEditor';
import { CookieConsentEditor } from '../components/admin/CookieConsentEditor';
import { SMTPSettingsEditor } from '../components/admin/SMTPSettingsEditor';
import { PackagesEditor } from '../components/admin/PackagesEditor';
import { ERPModulesEditor } from '../components/admin/ERPModulesEditor';
import SubmissionsEditor from '../components/admin/SubmissionsEditor';
import FooterEditor from '../components/admin/FooterEditor';
import HeaderEditor from '../components/admin/HeaderEditor';
import type {
  SiteSettings,
  HeroContent,
  FeatureCard,
  ProcessStep,
  Package as PackageType,
  Integration,
  ConsultingContent,
  Testimonial,
  ContactContent,
  WhyChoosePopup,
  IntegrationPopup,
  PlatformLogo,
  CustomPage,
  CookieConsentSettings,
  ERPModule,
} from '../types/cms';

interface AdminDashboardProps {
  onLogout: () => void;
}

type Tab = 'general' | 'header' | 'hero' | 'features' | 'why_choose_popups' | 'process' | 'packages' | 'erp_modules' | 'integrations' | 'integration_popups' | 'consulting' | 'testimonials' | 'contact' | 'legal' | 'custom_pages' | 'cookie_consent' | 'submissions' | 'platforms' | 'smtp' | 'footer';

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [features, setFeatures] = useState<FeatureCard[]>([]);
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [consultingContent, setConsultingContent] = useState<ConsultingContent | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [privacyPage, setPrivacyPage] = useState<LegalPage | null>(null);
  const [cookiesPage, setCookiesPage] = useState<LegalPage | null>(null);
  const [whyChoosePopups, setWhyChoosePopups] = useState<WhyChoosePopup[]>([]);
  const [integrationPopups, setIntegrationPopups] = useState<IntegrationPopup[]>([]);
  const [platforms, setPlatforms] = useState<PlatformLogo[]>([]);
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [cookieSettings, setCookieSettings] = useState<CookieConsentSettings | null>(null);
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState<string>('');
  const [erpModules, setErpModules] = useState<ERPModule[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadAllContent();
    checkRecaptchaConfig();
    loadUnreadCount();

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const { count } = await adminService.getUnreadSubmissionsCount();
      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const loadAllContent = async () => {
    try {
      const [
        settingsData,
        heroData,
        featuresData,
        stepsData,
        packagesData,
        integrationsData,
        consultingData,
        testimonialsData,
        contactData,
        submissionsData,
        privacyData,
        cookiesData,
        whyChoosePopupsData,
        integrationPopupsData,
        platformsData,
        customPagesData,
        cookieSettingsData,
        erpModulesData,
      ] = await Promise.all([
        cmsService.getSiteSettings(),
        cmsService.getHeroContent(),
        cmsService.getFeatureCards(),
        cmsService.getProcessSteps(),
        adminService.getAllPackages(),
        cmsService.getIntegrations(),
        cmsService.getConsultingContent(),
        adminService.getAllTestimonials(),
        cmsService.getContactContent(),
        adminService.getContactSubmissions(),
        cmsService.getLegalPage('privacy'),
        cmsService.getLegalPage('cookies'),
        cmsService.getWhyChoosePopups(),
        cmsService.getIntegrationPopups(),
        adminService.getAllPlatformLogos(),
        adminService.getAllCustomPages(),
        adminService.getCookieConsentSettings(),
        adminService.getAllERPModules(),
      ]);

      setSettings(settingsData);
      setHeroContent(heroData);
      setFeatures(featuresData);
      setSteps(stepsData);
      setPackages(packagesData);
      setIntegrations(integrationsData);
      setConsultingContent(consultingData);
      setTestimonials(testimonialsData);
      setContactContent(contactData);
      setSubmissions(submissionsData);
      setPrivacyPage(privacyData);
      setCookiesPage(cookiesData);
      setWhyChoosePopups(whyChoosePopupsData);
      setIntegrationPopups(integrationPopupsData);
      setPlatforms(platformsData);
      console.log('AdminDashboard loaded custom pages:', customPagesData.length, customPagesData);
      setCustomPages(customPagesData);
      setCookieSettings(cookieSettingsData);
      setErpModules(erpModulesData);
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const checkRecaptchaConfig = async () => {
    try {
      const siteKey = await cmsService.getRecaptchaSiteKey();
      setRecaptchaSiteKey(siteKey);
    } catch (error) {
      console.error('Error checking reCAPTCHA config:', error);
    }
  };

  const showSaveMessage = (message: string) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await adminService.updateSiteSettings(settings);
      showSaveMessage('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      showSaveMessage('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHero = async () => {
    if (!heroContent) return;
    setIsSaving(true);
    try {
      await adminService.updateHeroContent(heroContent);
      showSaveMessage('Hero content saved successfully');
    } catch (error) {
      console.error('Error saving hero content:', error);
      showSaveMessage('Error saving hero content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContact = async () => {
    if (!contactContent) return;
    setIsSaving(true);
    try {
      await adminService.updateContactContent(contactContent);
      showSaveMessage('Contact content saved successfully');
    } catch (error) {
      console.error('Error saving contact content:', error);
      showSaveMessage('Error saving contact content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveConsulting = async () => {
    if (!consultingContent) return;
    setIsSaving(true);
    try {
      await adminService.updateConsultingContent(consultingContent);
      showSaveMessage('Consulting content saved successfully');
    } catch (error) {
      console.error('Error saving consulting content:', error);
      showSaveMessage('Error saving consulting content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLegal = async () => {
    if (!privacyPage || !cookiesPage) return;

    setIsSaving(true);
    try {
      await Promise.all([
        adminService.updateLegalPage(privacyPage.id, privacyPage),
        adminService.updateLegalPage(cookiesPage.id, cookiesPage),
      ]);
      showSaveMessage('Legal pages saved successfully');
    } catch (error) {
      console.error('Error saving legal pages:', error);
      showSaveMessage('Error saving legal pages');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      onLogout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const tabs = [
    { id: 'general' as Tab, label: 'General Settings', icon: Settings },
    { id: 'header' as Tab, label: 'Header', icon: Menu },
    { id: 'hero' as Tab, label: 'Hero Section', icon: Home },
    { id: 'features' as Tab, label: 'Features', icon: Package },
    { id: 'why_choose_popups' as Tab, label: 'Why Choose Popups', icon: FileText },
    { id: 'platforms' as Tab, label: 'ERP Platforms', icon: Package },
    { id: 'process' as Tab, label: 'Process Steps', icon: FileText },
    { id: 'packages' as Tab, label: 'Packages', icon: Package },
    { id: 'erp_modules' as Tab, label: 'ERP Modules', icon: Package },
    { id: 'integrations' as Tab, label: 'Integrations', icon: Package },
    { id: 'integration_popups' as Tab, label: 'Integration Popups', icon: FileText },
    { id: 'consulting' as Tab, label: 'Consulting', icon: Users },
    { id: 'testimonials' as Tab, label: 'Testimonials', icon: Users },
    { id: 'contact' as Tab, label: 'Contact', icon: Mail },
    { id: 'footer' as Tab, label: 'Footer', icon: FileText },
    { id: 'legal' as Tab, label: 'Legal Pages', icon: FileText },
    { id: 'custom_pages' as Tab, label: 'Custom Pages', icon: FileText },
    { id: 'cookie_consent' as Tab, label: 'Cookie Consent', icon: Settings },
    { id: 'smtp' as Tab, label: 'SMTP & reCAPTCHA', icon: Mail },
    { id: 'submissions' as Tab, label: 'Submissions', icon: Mail, badge: unreadCount },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">DFlow ERP CMS</h1>
              <p className="text-sm text-gray-600">Admin Dashboard</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {saveMessage && (
          <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-lg">
            {saveMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge && tab.badge > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'general' && settings && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">General Settings</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo URL
                    </label>
                    <input
                      type="text"
                      value={settings.logo_url}
                      onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to use default text logo</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Slogan (English)
                      </label>
                      <input
                        type="text"
                        value={settings.site_slogan_en || ''}
                        onChange={(e) => setSettings({ ...settings, site_slogan_en: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Enhace your workflow"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Slogan (Bulgarian)
                      </label>
                      <input
                        type="text"
                        value={settings.site_slogan_bg || ''}
                        onChange={(e) => setSettings({ ...settings, site_slogan_bg: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Подобрете работния си процес"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Background Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hero Background Image URL
                        </label>
                        <input
                          type="text"
                          value={settings.hero_bg_image_url || ''}
                          onChange={(e) => setSettings({ ...settings, hero_bg_image_url: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="https://example.com/dashboard-screenshot.png"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Optional: Dashboard screenshot to display as subtle background in hero section
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hero Background Opacity: {((settings.hero_bg_opacity || 0.25) * 100).toFixed(0)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={settings.hero_bg_opacity || 0.25}
                          onChange={(e) => setSettings({ ...settings, hero_bg_opacity: parseFloat(e.target.value) })}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0% (Hidden)</span>
                          <span>50% (Balanced)</span>
                          <span>100% (Full)</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Recommended: 20-30% for subtle background effect
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={settings.company_name}
                      onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={settings.company_email}
                        onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={settings.company_phone}
                        onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={settings.company_address}
                      onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn URL
                      </label>
                      <input
                        type="text"
                        value={settings.linkedin_url}
                        onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        YouTube URL
                      </label>
                      <input
                        type="text"
                        value={settings.youtube_url}
                        onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook URL
                      </label>
                      <input
                        type="text"
                        value={settings.facebook_url}
                        onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Captcha Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Captcha Mode
                        </label>
                        <div className="flex items-center space-x-6">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="captchaMode"
                              value="testing"
                              checked={settings.captcha_mode === 'testing' || !settings.captcha_mode}
                              onChange={(e) => setSettings({ ...settings, captcha_mode: e.target.value })}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              Testing (Math Captcha)
                            </span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="captchaMode"
                              value="google"
                              checked={settings.captcha_mode === 'google'}
                              onChange={(e) => setSettings({ ...settings, captcha_mode: e.target.value })}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              Google reCAPTCHA
                            </span>
                          </label>
                        </div>
                      </div>
                      {settings.captcha_mode === 'google' && !recaptchaSiteKey && (
                        <div className="text-sm text-red-700 bg-red-50 rounded p-4 border border-red-200">
                          <p className="font-semibold mb-2">⚠️ reCAPTCHA Not Configured</p>
                          <p className="text-xs">
                            Google reCAPTCHA is not configured. Please contact the administrator to set up the reCAPTCHA site key before using this mode in production.
                          </p>
                        </div>
                      )}
                      <div className="text-xs text-gray-600 bg-white rounded p-3 border border-blue-100">
                        <p className="font-medium mb-1">ℹ️ Captcha Mode:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li><strong>Testing:</strong> Simple math captcha for development and testing</li>
                          <li><strong>Google reCAPTCHA:</strong> Production-ready Google reCAPTCHA (requires configuration)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Sections</h3>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.modules_section_enabled || false}
                          onChange={(e) => setSettings({ ...settings, modules_section_enabled: e.target.checked })}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            Show ERP Modules Section
                          </span>
                          <p className="text-xs text-gray-500">
                            Display the ERP Modules section on the homepage (appears after Packages section)
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.show_integrations_section || false}
                          onChange={(e) => setSettings({ ...settings, show_integrations_section: e.target.checked })}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            Show Platform Logos Section
                          </span>
                          <p className="text-xs text-gray-500">
                            Display "Built on proven open-source ERP platforms" with platform logos in the Features section
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
                  </button>
                </div>
              )}

              {activeTab === 'hero' && heroContent && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Hero Section</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={heroContent.headline}
                      onChange={(e) => setHeroContent({ ...heroContent, headline: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subheadline
                    </label>
                    <textarea
                      value={heroContent.subheadline}
                      onChange={(e) => setHeroContent({ ...heroContent, subheadline: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slogan
                    </label>
                    <input
                      type="text"
                      value={heroContent.slogan}
                      onChange={(e) => setHeroContent({ ...heroContent, slogan: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary CTA Text
                      </label>
                      <input
                        type="text"
                        value={heroContent.cta_primary_text}
                        onChange={(e) => setHeroContent({ ...heroContent, cta_primary_text: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary CTA Text
                      </label>
                      <input
                        type="text"
                        value={heroContent.cta_secondary_text}
                        onChange={(e) => setHeroContent({ ...heroContent, cta_secondary_text: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveHero}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    <span>{isSaving ? 'Saving...' : 'Save Hero Content'}</span>
                  </button>
                </div>
              )}

              {activeTab === 'contact' && contactContent && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Contact Section</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={contactContent.section_title}
                      onChange={(e) => setContactContent({ ...contactContent, section_title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subheadline
                    </label>
                    <input
                      type="text"
                      value={contactContent.subheadline}
                      onChange={(e) => setContactContent({ ...contactContent, subheadline: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Success Message
                    </label>
                    <input
                      type="text"
                      value={contactContent.success_message}
                      onChange={(e) => setContactContent({ ...contactContent, success_message: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <button
                    onClick={handleSaveContact}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    <span>{isSaving ? 'Saving...' : 'Save Contact Content'}</span>
                  </button>
                </div>
              )}

              {activeTab === 'legal' && privacyPage && cookiesPage && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Legal Pages</h2>
                    <p className="text-gray-600 mt-1">Edit privacy policy and cookie policy content</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 space-y-4 bg-white">
                    <h3 className="text-lg font-semibold text-gray-900">Privacy Policy</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title (English)
                        </label>
                        <input
                          type="text"
                          value={privacyPage.title_en}
                          onChange={(e) => setPrivacyPage({ ...privacyPage, title_en: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title (Bulgarian)
                        </label>
                        <input
                          type="text"
                          value={privacyPage.title_bg}
                          onChange={(e) => setPrivacyPage({ ...privacyPage, title_bg: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content (English)
                        </label>
                        <textarea
                          value={privacyPage.content_en}
                          onChange={(e) => setPrivacyPage({ ...privacyPage, content_en: e.target.value, content: e.target.value })}
                          rows={10}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content (Bulgarian)
                        </label>
                        <textarea
                          value={privacyPage.content_bg}
                          onChange={(e) => setPrivacyPage({ ...privacyPage, content_bg: e.target.value })}
                          rows={10}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 space-y-4 bg-white">
                    <h3 className="text-lg font-semibold text-gray-900">Cookies Policy</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title (English)
                        </label>
                        <input
                          type="text"
                          value={cookiesPage.title_en}
                          onChange={(e) => setCookiesPage({ ...cookiesPage, title_en: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title (Bulgarian)
                        </label>
                        <input
                          type="text"
                          value={cookiesPage.title_bg}
                          onChange={(e) => setCookiesPage({ ...cookiesPage, title_bg: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content (English)
                        </label>
                        <textarea
                          value={cookiesPage.content_en}
                          onChange={(e) => setCookiesPage({ ...cookiesPage, content_en: e.target.value, content: e.target.value })}
                          rows={10}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content (Bulgarian)
                        </label>
                        <textarea
                          value={cookiesPage.content_bg}
                          onChange={(e) => setCookiesPage({ ...cookiesPage, content_bg: e.target.value })}
                          rows={10}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveLegal}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    <span>{isSaving ? 'Saving...' : 'Save Legal Pages'}</span>
                  </button>
                </div>
              )}

              {activeTab === 'features' && (
                <FeaturesEditor features={features} onUpdate={loadAllContent} />
              )}

              {activeTab === 'platforms' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Built on Proven Open-Source ERP Platforms</h2>
                      <p className="text-gray-600 mt-2">Manage the platform logos displayed on the site.</p>
                    </div>
                    <button
                      onClick={async () => {
                        const newPlatform = {
                          name_en: 'New Platform',
                          name_bg: 'Нова платформа',
                          logo_url: 'https://via.placeholder.com/150',
                          order_index: platforms.length + 1,
                        };
                        setIsSaving(true);
                        try {
                          await adminService.createPlatformLogo(newPlatform);
                          showSaveMessage('Platform added successfully');
                          loadAllContent();
                        } catch (error) {
                          console.error('Error adding platform:', error);
                          showSaveMessage('Error adding platform');
                        } finally {
                          setIsSaving(false);
                        }
                      }}
                      disabled={isSaving}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Platform</span>
                    </button>
                  </div>

                  {platforms.map((platform, index) => (
                    <div key={platform.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-900">Platform #{index + 1}</h3>
                        <button
                          onClick={async () => {
                            if (!confirm('Are you sure you want to delete this platform?')) return;
                            setIsSaving(true);
                            try {
                              await adminService.deletePlatformLogo(platform.id);
                              showSaveMessage('Platform deleted successfully');
                              loadAllContent();
                            } catch (error) {
                              console.error('Error deleting platform:', error);
                              showSaveMessage('Error deleting platform');
                            } finally {
                              setIsSaving(false);
                            }
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name (English)
                          </label>
                          <input
                            type="text"
                            value={platform.name_en}
                            onChange={(e) => {
                              const updated = [...platforms];
                              updated[index].name_en = e.target.value;
                              setPlatforms(updated);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name (Bulgarian)
                          </label>
                          <input
                            type="text"
                            value={platform.name_bg}
                            onChange={(e) => {
                              const updated = [...platforms];
                              updated[index].name_bg = e.target.value;
                              setPlatforms(updated);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Logo URL
                        </label>
                        <input
                          type="text"
                          value={platform.logo_url}
                          onChange={(e) => {
                            const updated = [...platforms];
                            updated[index].logo_url = e.target.value;
                            setPlatforms(updated);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="https://example.com/logo.png"
                        />
                        {platform.logo_url && (
                          <img
                            src={platform.logo_url}
                            alt={platform.name_en}
                            className="mt-2 h-16 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                            }}
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Order Index
                        </label>
                        <input
                          type="number"
                          value={platform.order_index}
                          onChange={(e) => {
                            const updated = [...platforms];
                            updated[index].order_index = parseInt(e.target.value);
                            setPlatforms(updated);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <button
                        onClick={async () => {
                          setIsSaving(true);
                          try {
                            await adminService.updatePlatformLogo(platform.id, platform);
                            showSaveMessage('Platform saved successfully');
                          } catch (error) {
                            console.error('Error saving platform:', error);
                            showSaveMessage('Error saving platform');
                          } finally {
                            setIsSaving(false);
                          }
                        }}
                        disabled={isSaving}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'Saving...' : 'Save Platform'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'why_choose_popups' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Why Choose DFlow ERP - Popups</h2>
                  <p className="text-gray-600">Edit the popup content for "Why Choose DFlow ERP?" cards.</p>

                  {whyChoosePopups.map((popup, index) => (
                    <div key={popup.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {popup.popup_key.replace('why_', '').replace('_', ' ').toUpperCase()}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title (English)
                          </label>
                          <input
                            type="text"
                            value={popup.title_en}
                            onChange={(e) => {
                              const updated = [...whyChoosePopups];
                              updated[index].title_en = e.target.value;
                              setWhyChoosePopups(updated);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title (Bulgarian)
                          </label>
                          <input
                            type="text"
                            value={popup.title_bg}
                            onChange={(e) => {
                              const updated = [...whyChoosePopups];
                              updated[index].title_bg = e.target.value;
                              setWhyChoosePopups(updated);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Description (English) - Short text for the card
                          </label>
                          <textarea
                            value={popup.card_description_en}
                            onChange={(e) => {
                              const updated = [...whyChoosePopups];
                              updated[index].card_description_en = e.target.value;
                              setWhyChoosePopups(updated);
                            }}
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Description (Bulgarian) - Short text for the card
                          </label>
                          <textarea
                            value={popup.card_description_bg}
                            onChange={(e) => {
                              const updated = [...whyChoosePopups];
                              updated[index].card_description_bg = e.target.value;
                              setWhyChoosePopups(updated);
                            }}
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Popup Description (English) - Full text in popup
                          </label>
                          <textarea
                            value={popup.body_en}
                            onChange={(e) => {
                              const updated = [...whyChoosePopups];
                              updated[index].body_en = e.target.value;
                              setWhyChoosePopups(updated);
                            }}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Popup Description (Bulgarian) - Full text in popup
                          </label>
                          <textarea
                            value={popup.body_bg}
                            onChange={(e) => {
                              const updated = [...whyChoosePopups];
                              updated[index].body_bg = e.target.value;
                              setWhyChoosePopups(updated);
                            }}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Technical Details (English) - One per line
                          </label>
                          <textarea
                            value={popup.technical_details_en.join('\n')}
                            onChange={(e) => {
                              const updated = [...whyChoosePopups];
                              updated[index].technical_details_en = e.target.value.split('\n').filter(s => s.trim());
                              setWhyChoosePopups(updated);
                            }}
                            rows={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                            placeholder="One detail per line..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Technical Details (Bulgarian) - One per line
                          </label>
                          <textarea
                            value={popup.technical_details_bg.join('\n')}
                            onChange={(e) => {
                              const updated = [...whyChoosePopups];
                              updated[index].technical_details_bg = e.target.value.split('\n').filter(s => s.trim());
                              setWhyChoosePopups(updated);
                            }}
                            rows={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                            placeholder="Един детайл на ред..."
                          />
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          setIsSaving(true);
                          try {
                            await adminService.updateWhyChoosePopup(popup.id, popup);
                            showSaveMessage(`${popup.popup_key} saved successfully`);
                          } catch (error) {
                            console.error('Error saving popup:', error);
                            showSaveMessage('Error saving popup');
                          } finally {
                            setIsSaving(false);
                          }
                        }}
                        disabled={isSaving}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'Saving...' : 'Save This Popup'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'integration_popups' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Integration Popups</h2>
                  <p className="text-gray-600">Edit the popup content for integration cards.</p>

                  {integrationPopups.map((popup, index) => (
                    <div key={popup.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {popup.popup_key.replace('integration_', '').replace(/_/g, ' ').toUpperCase()}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title (English)
                          </label>
                          <input
                            type="text"
                            value={popup.title_en}
                            onChange={(e) => {
                              const updated = [...integrationPopups];
                              updated[index].title_en = e.target.value;
                              setIntegrationPopups(updated);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title (Bulgarian)
                          </label>
                          <input
                            type="text"
                            value={popup.title_bg}
                            onChange={(e) => {
                              const updated = [...integrationPopups];
                              updated[index].title_bg = e.target.value;
                              setIntegrationPopups(updated);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description (English)
                          </label>
                          <textarea
                            value={popup.body_en}
                            onChange={(e) => {
                              const updated = [...integrationPopups];
                              updated[index].body_en = e.target.value;
                              setIntegrationPopups(updated);
                            }}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description (Bulgarian)
                          </label>
                          <textarea
                            value={popup.body_bg}
                            onChange={(e) => {
                              const updated = [...integrationPopups];
                              updated[index].body_bg = e.target.value;
                              setIntegrationPopups(updated);
                            }}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Technical Details (English) - One per line
                          </label>
                          <textarea
                            value={popup.technical_details_en.join('\n')}
                            onChange={(e) => {
                              const updated = [...integrationPopups];
                              updated[index].technical_details_en = e.target.value.split('\n').filter(s => s.trim());
                              setIntegrationPopups(updated);
                            }}
                            rows={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                            placeholder="One detail per line..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Technical Details (Bulgarian) - One per line
                          </label>
                          <textarea
                            value={popup.technical_details_bg.join('\n')}
                            onChange={(e) => {
                              const updated = [...integrationPopups];
                              updated[index].technical_details_bg = e.target.value.split('\n').filter(s => s.trim());
                              setIntegrationPopups(updated);
                            }}
                            rows={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                            placeholder="Един детайл на ред..."
                          />
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          setIsSaving(true);
                          try {
                            await adminService.updateIntegrationPopup(popup.id, popup);
                            showSaveMessage(`${popup.popup_key} saved successfully`);
                          } catch (error) {
                            console.error('Error saving popup:', error);
                            showSaveMessage('Error saving popup');
                          } finally {
                            setIsSaving(false);
                          }
                        }}
                        disabled={isSaving}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'Saving...' : 'Save This Popup'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'submissions' && (
                <SubmissionsEditor />
              )}

              {activeTab === 'header' && (
                <HeaderEditor onSave={() => showSaveMessage('Header saved successfully')} />
              )}

              {activeTab === 'footer' && (
                <FooterEditor onSave={() => showSaveMessage('Footer saved successfully')} />
              )}

              {activeTab === 'process' && (
                <ProcessEditor steps={steps} onUpdate={loadAllContent} />
              )}

              {activeTab === 'integrations' && (
                <IntegrationsEditor integrations={integrations} onUpdate={loadAllContent} />
              )}

              {activeTab === 'consulting' && (
                <ConsultingEditor content={consultingContent} onUpdate={loadAllContent} />
              )}

              {activeTab === 'testimonials' && (
                <TestimonialsEditor testimonials={testimonials} onUpdate={loadAllContent} />
              )}

              {activeTab === 'packages' && (
                <PackagesEditor packages={packages} onUpdate={loadAllContent} />
              )}

              {activeTab === 'erp_modules' && (
                <ERPModulesEditor
                  modules={erpModules}
                  onUpdate={async (modules) => {
                    await adminService.updateERPModules(modules);
                    await loadAllContent();
                  }}
                />
              )}

              {activeTab === 'custom_pages' && (
                <CustomPagesEditor pages={customPages} onUpdate={loadAllContent} />
              )}

              {activeTab === 'cookie_consent' && (
                <CookieConsentEditor settings={cookieSettings} onUpdate={loadAllContent} />
              )}

              {activeTab === 'smtp' && (
                <SMTPSettingsEditor />
              )}

              {activeTab !== 'general' && activeTab !== 'hero' && activeTab !== 'contact' && activeTab !== 'legal' && activeTab !== 'submissions' && activeTab !== 'why_choose_popups' && activeTab !== 'integration_popups' && activeTab !== 'features' && activeTab !== 'platforms' && activeTab !== 'process' && activeTab !== 'integrations' && activeTab !== 'consulting' && activeTab !== 'testimonials' && activeTab !== 'packages' && activeTab !== 'erp_modules' && activeTab !== 'custom_pages' && activeTab !== 'cookie_consent' && activeTab !== 'smtp' && (
                <div className="text-center text-gray-600 py-12">
                  <p>This section is available for editing.</p>
                  <p className="text-sm mt-2">Use the API to manage {activeTab}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
