import React, { useState, useEffect, useCallback } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingAboutView from './components/LandingAboutView';
import DashboardToolbar from './components/DashboardToolbar';
import DashboardHome from './components/DashboardHome';
import IndicatorView from './components/IndicatorView';
import ComparisonHub from './components/ComparisonHub';
import WatchlistRecordView from './components/WatchlistRecordView';
import SystemHealthView from './components/SystemHealthView';
import UndoToast from './components/UndoToast';
import PageTransitionLoader from './components/PageTransitionLoader';
import CustomCursor from './components/CustomCursor';
import { fetchIndicators, fetchDashboardSummary, fetchCacheStats } from './services/api';
import { globalUndoStack } from './utils/dsa/undoStack';

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

  // Default to the new Clean Purple Business Landing Page
  const [activeTab, setActiveTabState] = useState('landing');
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  // Smooth Page Transition Handler
  const setActiveTab = useCallback((tabId) => {
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
  }, []);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [searchQuery, setSearchQuery] = useState('');

  // Data States
  const [topSummary, setTopSummary] = useState({});
  const [indicatorData, setIndicatorData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0, hitRate: '100%', size: 0 });

  // User Interactive Lists
  const [comparedList, setComparedList] = useState(['THA', 'USA', 'JPN', 'VNM']);
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('zonezet_watchlist');
      return saved ? JSON.parse(saved) : [
        { country: 'Thailand', countryCode: 'THA', iso2: 'th', region: 'East Asia', value: 2.8, displayValue: '2.8%', trend: 'up', colorClass: 'green', year: '2025' },
        { country: 'United States', countryCode: 'USA', iso2: 'us', region: 'North America', value: 2.5, displayValue: '2.5%', trend: 'up', colorClass: 'green', year: '2025' }
      ];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Sync Watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zonezet_watchlist', JSON.stringify(watchlist));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  }, [watchlist]);

  // Load Initial Top Summary and Cache Stats
  const loadSummaryAndStats = useCallback(async () => {
    try {
      const summaryRes = await fetchDashboardSummary();
      setTopSummary(summaryRes.data || {});
      if (summaryRes.cacheStats) {
        setCacheStats(summaryRes.cacheStats);
      }
    } catch (err) {
      console.warn('Dashboard summary error:', err);
    }

    try {
      const stats = await fetchCacheStats();
      setCacheStats(stats);
    } catch (err) {
      console.warn('Cache stats error:', err);
    }
  }, []);

  useEffect(() => {
    loadSummaryAndStats();
  }, [loadSummaryAndStats]);

  // Load Active Indicator Data when tab or year changes
  const loadIndicatorData = useCallback(async () => {
    if (!['gdp', 'inflation', 'unemployment'].includes(activeTab)) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchIndicators({
        type: activeTab,
        year: selectedYear,
        search: searchQuery
      });
      setIndicatorData(res.data || []);
      setIsLoading(false);

      // Refresh cache stats dynamically
      fetchCacheStats().then(setCacheStats).catch(() => {});
    } catch (err) {
      console.error('Error fetching indicator:', err);
      setError(err.message || 'ไม่สามารถโหลดข้อมูลตัวชี้วัดได้');
      setIsLoading(false);
    }
  }, [activeTab, selectedYear, searchQuery]);

  useEffect(() => {
    loadIndicatorData();
  }, [loadIndicatorData]);

  // Comparison Handlers
  const handleAddToCompare = (countryCode) => {
    if (!countryCode) return;
    const clean = countryCode.toUpperCase();
    if (comparedList.includes(clean)) {
      setActiveTab('compare');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (comparedList.length >= 5) {
      alert('สามารถเปรียบเทียบพร้อมกันได้สูงสุด 5 ประเทศ');
      return;
    }
    setComparedList([...comparedList, clean]);
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveFromCompare = (countryCode) => {
    const clean = countryCode.toUpperCase();
    globalUndoStack.push({
      type: 'REMOVE_COMPARE',
      payload: clean,
      timestamp: Date.now()
    });

    setComparedList(comparedList.filter(c => c !== clean));
    setToastMessage(`ลบประเทศ ${clean} ออกจากการเปรียบเทียบแล้ว`);
  };

  // Watchlist Handlers
  const handleAddToWatchlist = (item) => {
    if (watchlist.some(w => w.countryCode === item.countryCode)) {
      alert('ประเทศนี้อยู่ใน Watchlist แล้ว');
      return;
    }
    setWatchlist([item, ...watchlist]);
  };

  const handleRemoveFromWatchlist = (countryCode) => {
    const removedItem = watchlist.find(w => w.countryCode === countryCode);
    if (!removedItem) return;

    // Push into DSA Stack
    globalUndoStack.push({
      type: 'REMOVE_WATCHLIST',
      payload: removedItem,
      timestamp: Date.now()
    });

    setWatchlist(watchlist.filter(w => w.countryCode !== countryCode));
    setToastMessage(`ลบ ${removedItem.country} ออกจาก Watchlist แล้ว`);
  };

  // DSA Stack Undo / Rollback Handler
  const handleUndo = () => {
    const lastAction = globalUndoStack.pop();
    if (!lastAction) return;

    if (lastAction.type === 'REMOVE_WATCHLIST') {
      setWatchlist(prev => [lastAction.payload, ...prev]);
      setToastMessage(`กู้คืน ${lastAction.payload.country} กลับสู่ Watchlist แล้ว`);
    } else if (lastAction.type === 'REMOVE_COMPARE') {
      setComparedList(prev => [...prev, lastAction.payload]);
      setToastMessage(`กู้คืน ${lastAction.payload} สู่ Compare Hub แล้ว`);
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="biz-app-layout">
      {/* Luxury Interactive Trailing Cursor */}
      <CustomCursor />

      {/* Top Corporate Purple Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        compareCount={comparedList.length}
        watchlistCount={watchlist.length}
        cacheStats={cacheStats}
      />

      {/* Main Content Area */}
      <main className="biz-main-content">
        {/* Sleek Sub-Toolbar for Dashboard & Indicator views */}
        {['home', 'gdp', 'inflation', 'unemployment', 'health'].includes(activeTab) && (
          <DashboardToolbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            cacheStats={cacheStats}
          />
        )}

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
            setActiveTab={setActiveTab}
            onAddToCompare={handleAddToCompare}
          />
        )}

        {activeTab === 'gdp' && (
          <IndicatorView
            type="gdp"
            title={`อัตราการเติบโตทางเศรษฐกิจ GDP Growth (%) ประจำปี ${selectedYear}`}
            subtitle="วัดการขยายตัวของมูลค่าผลผลิตมวลรวมในประเทศ (World Bank Code: NY.GDP.MKTP.KD.ZG)"
            data={indicatorData}
            isLoading={isLoading}
            error={error}
            onRetry={loadIndicatorData}
            onAddToCompare={handleAddToCompare}
            comparedList={comparedList}
            onAddToWatchlist={handleAddToWatchlist}
            watchlist={watchlist}
          />
        )}

        {activeTab === 'inflation' && (
          <IndicatorView
            type="inflation"
            title={`ดัชนีราคาผู้บริโภค / อัตราเงินเฟ้อ Inflation Rate (%) ประจำปี ${selectedYear}`}
            subtitle="วัดการเปลี่ยนแปลงของดัชนีราคาสินค้าและบริการ CPI (World Bank Code: FP.CPI.TOTL.ZG)"
            data={indicatorData}
            isLoading={isLoading}
            error={error}
            onRetry={loadIndicatorData}
            onAddToCompare={handleAddToCompare}
            comparedList={comparedList}
            onAddToWatchlist={handleAddToWatchlist}
            watchlist={watchlist}
          />
        )}

        {activeTab === 'unemployment' && (
          <IndicatorView
            type="unemployment"
            title={`อัตราการว่างงาน Unemployment Rate (%) ประจำปี ${selectedYear}`}
            subtitle="สัดส่วนผู้ว่างงานต่อกำลังแรงงานรวม (World Bank Code: SL.UEM.TOTL.ZS)"
            data={indicatorData}
            isLoading={isLoading}
            error={error}
            onRetry={loadIndicatorData}
            onAddToCompare={handleAddToCompare}
            comparedList={comparedList}
            onAddToWatchlist={handleAddToWatchlist}
            watchlist={watchlist}
          />
        )}

        {activeTab === 'compare' && (
          <ComparisonHub
            comparedList={comparedList}
            setComparedList={setComparedList}
            onRemoveFromCompare={handleRemoveFromCompare}
            selectedYear={selectedYear}
          />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistRecordView
            watchlist={watchlist}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
            onUndoLastRemove={handleUndo}
            hasUndo={!globalUndoStack.isEmpty()}
            onCompareAll={() => {
              const codes = watchlist.map(w => w.countryCode).filter(Boolean);
              if (codes.length > 0) {
                setComparedList(codes.slice(0, 5));
                setActiveTab('compare');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'health' && (
          <SystemHealthView
            selectedYear={selectedYear}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Universal Footer across ALL pages */}
      <Footer setActiveTab={setActiveTab} lenis={lenisInstance} />

      {/* Floating Undo Notification */}
      <UndoToast
        message={toastMessage}
        onUndo={handleUndo}
        onClose={() => setToastMessage(null)}
      />

      {/* Mario Page Transition Loader */}
      {isPageTransitioning && (
        <PageTransitionLoader text="กำลังโหลดข้อมูล" />
      )}
    </div>
  );
}
