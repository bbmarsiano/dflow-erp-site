import { useState, useEffect } from 'react';
import type React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/sections/HeroSection';
import { FeaturesSection } from '../components/sections/FeaturesSection';
import { ProcessSection } from '../components/sections/ProcessSection';
import { PackagesSection } from '../components/sections/PackagesSection';
import { ERPModulesSection } from '../components/sections/ERPModulesSection';
import { IntegrationsSection } from '../components/sections/IntegrationsSection';
import { ConsultingSection } from '../components/sections/ConsultingSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { ContactSection } from '../components/sections/ContactSection';
import { BlogSection } from '../components/sections/BlogSection';
import { cmsService } from '../services/cmsService';
import type {
  SiteSettings,
  HeroContent,
  FeatureCard,
  ProcessStep,
  Package,
  Integration,
  ConsultingContent,
  Testimonial,
  ContactContent,
  PlatformLogo,
  ERPModule,
} from '../types/cms';

export function HomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [features, setFeatures] = useState<FeatureCard[]>([]);
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [consultingContent, setConsultingContent] = useState<ConsultingContent | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [platforms, setPlatforms] = useState<PlatformLogo[]>([]);
  const [erpModules, setErpModules] = useState<ERPModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
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
          platformsData,
          erpModulesData,
        ] = await Promise.all([
          cmsService.getSiteSettings(),
          cmsService.getHeroContent(),
          cmsService.getFeatureCards(),
          cmsService.getProcessSteps(),
          cmsService.getPackages(),
          cmsService.getIntegrations(),
          cmsService.getConsultingContent(),
          cmsService.getTestimonials(),
          cmsService.getContactContent(),
          cmsService.getPlatformLogos(),
          cmsService.getERPModules(),
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
        setPlatforms(platformsData);
        setErpModules(erpModulesData);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  // Handle hash navigation after page loads (only for section anchors, not page routes)
  useEffect(() => {
    if (!isLoading) {
      const hash = window.location.hash;
      // Only handle section anchors (#contact, #hero), not page routes (#/insights)
      if (hash && !hash.startsWith('#/')) {
        const sectionId = hash.substring(1); // Remove the #
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100); // Small delay to ensure DOM is ready
      }
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-teal-700">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Get accent color from settings with default fallback
  const accentColor = settings?.accent_color || '#de3c3c';

  return (
    <div 
      className="min-h-screen"
      style={{
        '--accent-color': accentColor,
      } as React.CSSProperties}
    >
      <Header settings={settings} />
      <main>
        <HeroSection
          content={heroContent}
          bgImageUrl={settings?.hero_bg_image_url}
          bgOpacity={settings?.hero_bg_opacity}
          settings={settings}
        />
        <FeaturesSection features={features} settings={settings} platforms={platforms} />
        <ProcessSection steps={steps} />
        <PackagesSection packages={packages} settings={settings} />
        {settings?.modules_section_enabled && erpModules.length > 0 && (
          <ERPModulesSection modules={erpModules} />
        )}
        {integrations.length > 0 && (
          <IntegrationsSection integrations={integrations} />
        )}
        <ConsultingSection content={consultingContent} />
        <TestimonialsSection testimonials={testimonials} />
        {settings?.blog_home_section_enabled === 'true' && (
          <BlogSection settings={settings} />
        )}
        <ContactSection content={contactContent} settings={settings} />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
