import { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';
import ScrollToTop from './components/ScrollToTop';
import Showcase from './pages/public/Showcase';
import Create from './pages/public/Create';
import Contact from './pages/public/Contact';
import About from './pages/public/About';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';
import FixedCTA from './components/FixedCTA';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

function MainRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Showcase />} />
        <Route path="/create" element={<Create />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const location = useLocation();
  const routeKey = `${location.pathname}${location.search}`;

  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [routeLoading, setRouteLoading] = useState(false);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'theme-light', 'theme-dark');
    root.classList.add(theme);
    root.classList.add(`theme-${theme}`);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      setRouteLoading(false);
      return;
    }
    setRouteLoading(true);
    const timer = window.setTimeout(() => { setRouteLoading(false); }, 150);
    return () => window.clearTimeout(timer);
  }, [routeKey]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const showPageLoader = routeLoading;

  return (
    <>
      <PageLoader visible={showPageLoader} theme={theme} />
      <ScrollToTop />
      <div className="bg-background text-text min-h-screen transition-colors duration-500 selection:bg-primary selection:text-white w-full">
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main className="w-full">
          <MainRoutes />
        </main>
        {!isMobile && <Footer theme={theme} />}
        <FixedCTA />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;