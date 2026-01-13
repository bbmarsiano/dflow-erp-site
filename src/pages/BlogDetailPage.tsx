import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { cmsService } from '../services/cmsService';
import type { BlogPost, SiteSettings } from '../types/cms';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedField } from '../utils/language';

interface BlogDetailPageProps {
  slug: string;
}

export function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const { language } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      loadContent();
    }
  }, [slug]);

  const loadContent = async () => {
    if (!slug) return;

    try {
      const [postData, settingsData] = await Promise.all([
        cmsService.getBlogPostBySlug(slug),
        cmsService.getSiteSettings(),
      ]);

      if (!postData) {
        setNotFound(true);
      } else {
        setPost(postData);
      }
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading blog post:', error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'bg' ? 'bg-BG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-teal-700">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen">
        <Header settings={settings} />
        <main className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'bg' ? 'Статията не е намерена' : 'Post Not Found'}
            </h1>
            <p className="text-gray-600 mb-8">
              {language === 'bg'
                ? 'Статията, която търсите, не съществува или не е публикувана.'
                : 'The post you are looking for does not exist or is not published.'}
            </p>
            <a
              href="/blog"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/blog';
              }}
            >
              {language === 'bg' ? '← Назад към блога' : '← Back to Blog'}
            </a>
          </div>
        </main>
        <Footer settings={settings} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header settings={settings} />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <a
                href="/blog"
                className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/blog';
                }}
              >
                <span className="mr-2">←</span>
                {language === 'bg' ? 'Назад към блога' : 'Back to Blog'}
              </a>
              
              {post.client_name && (
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                    {post.client_name}
                    {post.client_industry && ` • ${post.client_industry}`}
                  </span>
                </div>
              )}
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                {getLocalizedField(post, 'title', language)}
              </h1>
              
              {post.published_at && (
                <p className="text-blue-100 text-lg">
                  {formatDate(post.published_at)}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {getLocalizedField(post, 'excerpt', language)}
                </p>
                
                <div
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: language === 'bg' ? post.content_bg : post.content_en,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}

