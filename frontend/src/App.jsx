import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UndoToast from './components/UndoToast';
import PageTransitionLoader from './components/PageTransitionLoader';
import CustomCursor from './components/CustomCursor';
import { LoadingSkeleton } from './components/FeedbackStates';
import { fetchIndicators, fetchDashboardSummary, fetchCacheStats } from './services/api';
import { globalUndoStack } from './utils/dsa/undoStack';

// Route-level dynamic imports with preloader factories (bundle-dynamic-imports & bundle-preload)
const loadLandingAboutView = () => import('./components/LandingAboutView');
const loadDashboardHome = () => import('./components/DashboardHome');
const loadIndicatorView = () => import('./components/IndicatorView');
const loadComparisonHub = () => import('./components/ComparisonHub');
const loadSystemHealthView = () => import('./components/SystemHealthView');
const loadCompareModal = () => import('./components/CompareModal');

const LandingAboutView = lazy(loadLandingAboutView);
const DashboardHome = lazy(loadDashboardHome);
const IndicatorView = lazy(loadIndicatorView);
const ComparisonHub = lazy(loadComparisonHub);
const SystemHealthView = lazy(loadSystemHealthView);
const CompareModal = lazy(loadCompareModal);

const VALID_TABS = new Set(['landing', 'home', 'gdp', 'inflation', 'unemployment', 'compare', 'health']);

// In-memory storage cache to minimize synchronous localStorage reads (js-cache-storage)
const storageCache = new Map();
function getCachedStorage(key) {
  if (!storageCache.has(key)) {
    try {
      storageCache.set(key, localStorage.getItem(key));
    } catch {
      return null;
    }
  }
  return storageCache.get(key);
}
function setCachedStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    storageCache.set(key, value);
  } catch (e) {
    console.warn('Storage error:', e);
  }
}

export default function App() {
  const [lenisInstance, setLenisInstance] = useState(null);

  // Initialize Lenis Ultra-Smooth Momentum Scrolling (LuxDrive Luxury Feel)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious exponential decay
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      prevent: (node) => {
        return (
          node?.hasAttribute?.('data-lenis-prevent') ||
          Boolean(node?.closest?.('[data-lenis-prevent], .compare-search-dropdown-menu, .compare-search-results-list, .compare-modal-content, .db-custom-dropdown-menu'))
        );
      },
      wheelMultiplier: 1.05,
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.__lenis = lenis;
    setLenisInstance(lenis);

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Global anchor link smooth scroll handler
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        const href = target.getAttribute('href');
        if (href && href.length > 1) {
          const el = document.querySelector(href);
          if (el) {
            e.preventDefault();
            lenis.scrollTo(el, { offset: -20, duration: 1.2 });
          }
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
      delete window.__lenis;
      setLenisInstance(null);
    };
  }, []);

  // Persistent Active Tab from URL Hash or localStorage
  const getInitialTab = () => {
    try {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && VALID_TABS.has(hash)) {
        return hash;
      }
      const savedTab = getCachedStorage('zonezet_active_tab');
      if (savedTab && VALID_TABS.has(savedTab)) {
        return savedTab;
      }
    } catch (e) {
      console.warn('Tab persistence error:', e);
    }
    return 'landing';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  // Preload route chunk on hover/focus (bundle-preload)
  const handlePreloadTab = useCallback((tabId) => {
    switch (tabId) {
      case 'landing':
        loadLandingAboutView();
        break;
      case 'home':
        loadDashboardHome();
        break;
      case 'gdp':
      case 'inflation':
      case 'unemployment':
        loadIndicatorView();
        break;
      case 'compare':
        loadComparisonHub();
        break;
      case 'health':
        loadSystemHealthView();
        break;
      default:
        break;
    }
  }, []);

  // Sync activeTab to localStorage and URL Hash
  useEffect(() => {
    setCachedStorage('zonezet_active_tab', activeTab);
    if (window.location.hash.replace('#', '') !== activeTab) {
      window.history.replaceState(null, '', `#${activeTab}`);
    }
  }, [activeTab]);

  // Handle browser Back / Forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && VALID_TABS.has(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Smooth Page Transition Handler
  const setActiveTab = useCallback((tabId) => {
    handlePreloadTab(tabId);
    setActiveTabState((prev) => {
      if (prev === tabId) return prev;
      setIsPageTransitioning(true);
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      setTimeout(() => {
        setIsPageTransitioning(false);
      }, 500);
      return tabId;
    });
  }, [handlePreloadTab]);

  const [selectedYear, setSelectedYear] = useState('2025');
  const [searchQuery] = useState('');

  // Data States
  const [topSummary, setTopSummary] = useState({});
  const [indicatorData, setIndicatorData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0, hitRate: '100%', size: 0 });

  // User Interactive Lists with Permanent LocalStorage Persistence
  const [comparedList, setComparedList] = useState(() => {
    try {
      const saved = getCachedStorage('zonezet_compared_list');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Compared list localStorage load error:', e);
    }
    return ['THA', 'USA', 'JPN', 'VNM'];
  });
  const [toastMessage, setToastMessage] = useState(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Sync Compared List to localStorage (Permanent deletion and persistence)
  useEffect(() => {
    setCachedStorage('zonezet_compared_list', JSON.stringify(comparedList));
  }, [comparedList]);

  // Load Initial Top Summary and Cache Stats in parallel (async-parallel)
  const loadSummaryAndStats = useCallback(async (year = selectedYear) => {
    const [summaryResult, statsResult] = await Promise.allSettled([
      fetchDashboardSummary(year),
      fetchCacheStats()
    ]);

    if (summaryResult.status === 'fulfilled' && summaryResult.value) {
      setTopSummary(summaryResult.value.data || {});
      if (summaryResult.value.cacheStats) {
        setCacheStats(summaryResult.value.cacheStats);
      }
    } else if (summaryResult.status === 'rejected') {
      console.warn('Dashboard summary error:', summaryResult.reason);
    }

    if (statsResult.status === 'fulfilled' && statsResult.value) {
      setCacheStats(statsResult.value);
    }
  }, [selectedYear]);

  useEffect(() => {
    loadSummaryAndStats(selectedYear);
  }, [selectedYear, loadSummaryAndStats]);

  // Load Active Indicator Data when tab or year changes with AbortController protection
  const loadIndicatorData = useCallback(async (signal) => {
    if (!['gdp', 'inflation', 'unemployment'].includes(activeTab)) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchIndicators({
        type: activeTab,
        year: selectedYear,
        search: searchQuery,
        signal
      });
      if (signal?.aborted) return;
      setIndicatorData(res.data || []);
      setIsLoading(false);

      // Refresh cache stats dynamically in background
      fetchCacheStats().then(setCacheStats).catch(() => {});
    } catch (err) {
      if (err.name === 'AbortError' || signal?.aborted) return;
      console.error('Error fetching indicator:', err);
      setError(err.message || 'ไม่สามารถโหลดข้อมูลตัวชี้วัดได้');
      setIsLoading(false);
    }
  }, [activeTab, selectedYear, searchQuery]);

  useEffect(() => {
    const controller = new AbortController();
    loadIndicatorData(controller.signal);
    return () => controller.abort();
  }, [loadIndicatorData]);

  // Memoized Comparison & Undo Handlers (rerender-functional-setstate)
  const handleAddToCompare = useCallback((countryCode) => {
    if (!countryCode) return;
    const clean = countryCode.toUpperCase();
    setComparedList((prev) => {
      if (prev.includes(clean)) {
        globalUndoStack.push({
          type: 'REMOVE_COMPARE',
          payload: clean,
          timestamp: Date.now()
        });
        setToastMessage(`นำ ${clean} ออกจากชุดเปรียบเทียบแล้ว`);
        return prev.filter((c) => c && c.toUpperCase() !== clean);
      }
      if (prev.length >= 4) {
        alert('สามารถเปรียบเทียบพร้อมกันได้สูงสุด 4 ประเทศ (หากต้องการเลือกประเทศใหม่ กรุณานำประเทศเดิมออกก่อน)');
        return prev;
      }
      const updated = [...prev, clean];
      setToastMessage(`เพิ่ม ${clean} เข้าชุดเปรียบเทียบแล้ว (${updated.length}/4)`);
      return updated;
    });
  }, []);

  const handleRemoveFromCompare = useCallback((countryCode) => {
    if (!countryCode) return;
    const clean = countryCode.toUpperCase();
    globalUndoStack.push({
      type: 'REMOVE_COMPARE',
      payload: clean,
      timestamp: Date.now()
    });

    setComparedList((prev) => prev.filter((c) => c && c.toUpperCase() !== clean));
    setToastMessage(`ลบประเทศ ${clean} ออกจากการเปรียบเทียบแล้ว`);
  }, []);

  const handleUndo = useCallback(() => {
    const lastAction = globalUndoStack.pop();
    if (!lastAction) return;
    if (lastAction.type === 'REMOVE_COMPARE') {
      setComparedList((prev) => (prev.includes(lastAction.payload) ? prev : [...prev, lastAction.payload]));
      setToastMessage(`กู้คืน ${lastAction.payload} สู่ Compare Hub แล้ว`);
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  const handleCloseToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const handleCloseCompareModal = useCallback(() => {
    setIsCompareModalOpen(false);
  }, []);

  const handleOpenFullHub = useCallback(() => {
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setActiveTab]);

  return (
    <div className="biz-app-layout">
      {/* Luxury Interactive Trailing Cursor */}
      <CustomCursor />

      {/* Top Corporate Purple Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPreloadTab={handlePreloadTab}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        compareCount={comparedList.length}
        cacheStats={cacheStats}
      />

      {/* Main Content Area with Route-Level Code Splitting */}
      <main className="biz-main-content">
        <Suspense fallback={<LoadingSkeleton text="กำลังโหลดโมดูลวิเคราะห์เศรษฐกิจ..." />}>
          {activeTab === 'landing' && (
            <LandingAboutView
              setActiveTab={setActiveTab}
              selectedYear={selectedYear}
              topSummary={topSummary}
              cacheStats={cacheStats}
            />
          )}

          {activeTab === 'home' && (
            <DashboardHome
              topSummary={topSummary}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              setActiveTab={setActiveTab}
              onAddToCompare={handleAddToCompare}
            />
          )}

          {activeTab === 'gdp' && (
            <IndicatorView
              type="gdp"
              title={`อัตราการเติบโตทางเศรษฐกิจ GDP Growth Rate ประจำปี ${selectedYear}`}
              subtitle="วิเคราะห์การขยายตัวทางเศรษฐกิจและมูลค่าผลผลิตมวลรวมในแต่ละประเทศ"
              data={indicatorData}
              isLoading={isLoading}
              error={error}
              onRetry={() => loadIndicatorData()}
              onAddToCompare={handleAddToCompare}
              comparedList={comparedList}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          )}

          {activeTab === 'inflation' && (
            <IndicatorView
              type="inflation"
              title={`อัตราเงินเฟ้อ Inflation Rate ประจำปี ${selectedYear}`}
              subtitle="ติดตามเสถียรภาพระดับราคาสินค้า อัตราค่าครองชีพ และกำลังซื้อของผู้บริโภค"
              data={indicatorData}
              isLoading={isLoading}
              error={error}
              onRetry={() => loadIndicatorData()}
              onAddToCompare={handleAddToCompare}
              comparedList={comparedList}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          )}

          {activeTab === 'unemployment' && (
            <IndicatorView
              type="unemployment"
              title={`อัตราการว่างงาน Unemployment Rate ประจำปี ${selectedYear}`}
              subtitle="สำรวจโครงสร้างการจ้างงาน สัดส่วนประชากรในวัยทำงาน และศักยภาพตลาดแรงงาน"
              data={indicatorData}
              isLoading={isLoading}
              error={error}
              onRetry={() => loadIndicatorData()}
              onAddToCompare={handleAddToCompare}
              comparedList={comparedList}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          )}

          {activeTab === 'compare' && (
            <ComparisonHub
              comparedList={comparedList}
              setComparedList={setComparedList}
              onAddToCompare={handleAddToCompare}
              onRemoveFromCompare={handleRemoveFromCompare}
              selectedYear={selectedYear}
            />
          )}

          {activeTab === 'health' && (
            <SystemHealthView
              selectedYear={selectedYear}
              setActiveTab={setActiveTab}
            />
          )}
        </Suspense>
      </main>

      {/* Universal Footer across ALL pages */}
      <Footer setActiveTab={setActiveTab} lenis={lenisInstance} />

      {/* In-Page Instant Comparison Modal (Lazy-loaded only when opened) */}
      {isCompareModalOpen && (
        <Suspense fallback={null}>
          <CompareModal
            isOpen={isCompareModalOpen}
            onClose={handleCloseCompareModal}
            comparedList={comparedList}
            setComparedList={setComparedList}
            onRemoveFromCompare={handleRemoveFromCompare}
            currentTab={activeTab}
            selectedYear={selectedYear}
            onOpenFullHub={handleOpenFullHub}
          />
        </Suspense>
      )}

      {/* Floating Undo Notification */}
      <UndoToast
        message={toastMessage}
        onUndo={handleUndo}
        onClose={handleCloseToast}
      />

      {/* Mario Page Transition Loader */}
      {isPageTransitioning && (
        <PageTransitionLoader text="กำลังโหลดข้อมูล" />
      )}
    </div>
  );
}
