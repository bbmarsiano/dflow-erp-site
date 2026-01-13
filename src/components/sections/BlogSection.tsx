import { useState, useEffect } from 'react';
import { cmsService } from '../../services/cmsService';
import type { BlogPost, SiteSettings } from '../../types/cms';
import { useLanguage } from '../../contexts/LanguageContext';
import { getLocalizedField } from '../../utils/language';

interface BlogSectionProps {
  settings: SiteSettings | null;
}

export function BlogSection({ settings }: BlogSectionProps) {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (settings?.blog_home_section_enabled === 'true') {
      loadPosts();
    } else {
      setIsLoading(false);
    }
  }, [settings]);

  const loadPosts = async () => {
    try {
      const data = await cmsService.getBlogPostsForHome();
      setPosts(data);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !settings || settings.blog_home_section_enabled !== 'true' || posts.length === 0) {
    return null;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'bg' ? 'bg-BG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {language === 'bg' ? 'Последни случаи от практиката' : 'Latest Use Cases'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'bg'
                ? 'Разгледайте как наши клиенти подобряват своите бизнес процеси с DFlow ERP'
                : 'See how our clients improve their business processes with DFlow ERP'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
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

                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
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
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {getLocalizedField(post, 'excerpt', language)}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{formatDate(post.published_at)}</span>
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

          <div className="text-center mt-12">
            <a
              href="/blog"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/blog';
              }}
            >
              {language === 'bg' ? 'Виж всички статии' : 'View All Posts'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

