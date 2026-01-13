import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { cmsService } from '../services/cmsService';
import type { BlogPost, SiteSettings } from '../types/cms';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedField } from '../utils/language';

export function BlogPage() {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [postsData, settingsData] = await Promise.all([
        cmsService.getBlogPosts(true),
        cmsService.getSiteSettings(),
      ]);
      setPosts(postsData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading blog content:', error);
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

  return (
    <div className="min-h-screen">
      <Header settings={settings} />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                {settings?.blog_menu_label_bg && settings?.blog_menu_label_en
                  ? (language === 'bg' ? settings.blog_menu_label_bg : settings.blog_menu_label_en)
                  : (language === 'bg' ? 'Блог' : 'Blog')}
              </h1>
              <p className="text-xl text-blue-100">
                {language === 'bg'
                  ? 'Случаи от практиката и полезни статии'
                  : 'Use cases and helpful articles'}
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {language === 'bg' ? 'Все още няма публикувани статии.' : 'No published posts yet.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                  >
                    <div className="p-6">
                      {post.client_name && (
                        <div className="mb-3">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {post.client_name}
                            {post.client_industry && ` • ${post.client_industry}`}
                          </span>
                        </div>
                      )}
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        <a
                          href={`/blog/${post.slug}`}
                          className="hover:text-blue-600 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/blog/${post.slug}`;
                          }}
                        >
                          {getLocalizedField(post, 'title', language)}
                        </a>
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {getLocalizedField(post, 'excerpt', language)}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{formatDate(post.published_at)}</span>
                        <a
                          href={`/blog/${post.slug}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/blog/${post.slug}`;
                          }}
                        >
                          {language === 'bg' ? 'Прочети още →' : 'Read more →'}
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}

