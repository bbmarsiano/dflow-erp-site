import { useEffect, useState, useCallback } from 'react';
import { HomePage } from './pages/HomePage';
import { LegalPage } from './pages/LegalPage';
import { CustomPage } from './pages/CustomPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { CookieConsent } from './components/CookieConsent';
import { authService } from './services/authService';

/**
 * Get the current path from window.location.hash
 * - If hash starts with #/, treat it as a page route (e.g., #/insights -> /insights)
 * - If hash is empty or doesn't start with #/, treat as home page (e.g., #contact -> /)
 */
function getCurrentPathFromHash(): string {
  const rawHash = window.location.hash || '';

  if (rawHash.startsWith('#/')) {
    // Turn "#/insights/proba" into "/insights/proba"
    return rawHash.slice(1);
  }

  // For "", "#contact", "#hero" etc. -> treat as home
  return '/';
}


function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'privacy' | 'cookies' | 'admin' | 'blog' | 'blog-detail' | 'custom'>('home');
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

  const handleRouting = useCallback(() => {
    const path = getCurrentPathFromHash();
    // Normalize path: remove trailing slashes (except root)
    const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');
    
    if (normalizedPath === '/privacy') {
      setCurrentPage('privacy');
    } else if (normalizedPath === '/cookies') {
      setCurrentPage('cookies');
    } else if (normalizedPath === '/admin') {
      setCurrentPage('admin');
    } else if (normalizedPath === '/insights') {
      setCurrentPage('blog');
      setCustomPageSlug(''); // Clear slug when on blog list
    } else if (normalizedPath.startsWith('/insights/')) {
      const slug = normalizedPath.replace('/insights/', '').replace(/\/$/, '');
      if (slug) {
        setCurrentPage('blog-detail');
        setCustomPageSlug(slug);
      } else {
        // If /insights/ with no slug, redirect to /insights
        setCurrentPage('blog');
        setCustomPageSlug('');
        window.location.hash = '#/insights';
      }
    } else if (normalizedPath === '/' || normalizedPath === '') {
      setCurrentPage('home');
      setCustomPageSlug('');
    } else {
      const slug = normalizedPath.replace(/^\//, '').replace(/\/$/, '');
      setCustomPageSlug(slug);
      setCurrentPage('custom');
    }
  }, []);

  useEffect(() => {
    // Handle initial route on mount
    handleRouting();

    const onHashChange = () => {
      handleRouting();
    };

    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [handleRouting]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.hash) {
        // Handle hash links
        // For page routes (#/...), hashchange event will trigger handleRouting
        // For section anchors (#contact, #hero), let browser handle normally
        // No need to prevent default - browser will handle hash navigation
      } else if (link && link.href.startsWith(window.location.origin) && !link.hash) {
        // Handle non-hash links (legacy paths - convert to hash routes)
        e.preventDefault();
        const path = link.pathname;
        if (path !== '/') {
          // Convert path to hash route
          window.location.hash = path;
        } else {
          window.location.hash = '';
        }
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
      window.location.hash = '';
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
