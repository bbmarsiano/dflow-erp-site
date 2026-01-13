import { useEffect, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { LegalPage } from './pages/LegalPage';
import { CustomPage } from './pages/CustomPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { CookieConsent } from './components/CookieConsent';
import { authService } from './services/authService';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'privacy' | 'cookies' | 'admin' | 'custom'>('home');
  const [customPageSlug, setCustomPageSlug] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authService.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();

    const { data: authListener } = authService.onAuthStateChange((session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    handleRouting(path);

    const handlePopState = () => {
      const path = window.location.pathname;
      handleRouting(path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleRouting = (path: string) => {
    if (path === '/privacy') {
      setCurrentPage('privacy');
    } else if (path === '/cookies') {
      setCurrentPage('cookies');
    } else if (path === '/admin') {
      setCurrentPage('admin');
    } else if (path === '/blog') {
      setCurrentPage('blog');
    } else if (path.startsWith('/blog/')) {
      setCurrentPage('blog-detail');
      setCustomPageSlug(path.replace('/blog/', ''));
    } else if (path === '/' || path === '') {
      setCurrentPage('home');
    } else {
      const slug = path.replace(/^\//, '');
      setCustomPageSlug(slug);
      setCurrentPage('custom');
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const path = link.pathname;
        window.history.pushState({}, '', path);
        handleRouting(path);
        window.scrollTo(0, 0);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (currentPage === 'admin') {
    if (!isAuthenticated) {
      return <AdminLoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
    }
    return <AdminDashboard onLogout={() => {
      setIsAuthenticated(false);
      setCurrentPage('home');
      window.history.pushState({}, '', '/');
    }} />;
  }

  if (currentPage === 'privacy') {
    return <LegalPage pageType="privacy" />;
  }

  if (currentPage === 'cookies') {
    return <LegalPage pageType="cookies" />;
  }

  if (currentPage === 'blog') {
    return <BlogPage />;
  }

  if (currentPage === 'blog-detail') {
    return <BlogDetailPage slug={customPageSlug} />;
  }

  if (currentPage === 'custom') {
    return <CustomPage slug={customPageSlug} />;
  }

  return (
    <>
      <HomePage />
      <CookieConsent />
    </>
  );
}

export default App;
