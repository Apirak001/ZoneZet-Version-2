import React, { useState, useEffect, useCallback } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingAboutView from './components/LandingAboutView';
import DashboardHome from './components/DashboardHome';
import IndicatorView from './components/IndicatorView';
import ComparisonHub from './components/ComparisonHub';
import SystemHealthView from './components/SystemHealthView';
import UndoToast from './components/UndoToast';
import CompareFloatingDock from './components/CompareFloatingDock';
import CompareModal from './components/CompareModal';
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

  // Persistent Active Tab from URL Hash or localStorage
  const getInitialTab = () => {
    try {
      const hash = window.location.hash.replace('#', '').trim();
      const validTabs = ['landing', 'home', 'gdp', 'inflation', 'unemployment', 'compare', 'health'];
      if (hash && validTabs.includes(hash)) {
        return hash;
      }
      const savedTab = localStorage.getItem('zonezet_active_tab');
      if (savedTab && validTabs.includes(savedTab)) {
        return savedTab;
      }
    } catch (e) {
      console.warn('Tab persistence error:', e);
    }
    return 'landing';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  // Sync activeTab to localStorage and URL Hash
  useEffect(() => {
    try {
      localStorage.setItem('zonezet_active_tab', activeTab);
      if (window.location.hash.replace('#', '') !== activeTab) {
        window.history.replaceState(null, '', `#${activeTab}`);
      }
    } catch (e) {
      console.warn('Tab storage error:', e);
    }
  }, [activeTab]);

  // Handle browser Back / Forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      const validTabs = ['landing', 'home', 'gdp', 'inflation', 'unemployment', 'compare', 'health'];
      if (hash && validTabs.includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

  // User Interactive Lists with Permanent LocalStorage Persistence
  const [comparedList, setComparedList] = useState(() => {
    try {
      const saved = localStorage.getItem('zonezet_compared_list');
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
    try {
      localStorage.setItem('zonezet_compared_list', JSON.stringify(comparedList));
    } catch (err) {
      console.warn('LocalStorage compared sync error:', err);
    }
  }, [comparedList]);
  // Load Initial Top Summary and Cache Stats
  const loadSummaryAndStats = useCallback(async (year = selectedYear) => {
    try {
      const summaryRes = await fetchDashboardSummary(year);
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
  }, [selectedYear]);

  useEffect(() => {
    loadSummaryAndStats(selectedYear);
  }, [selectedYear, loadSummaryAndStats]);

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
    setComparedList((prev) => {
      if (prev.includes(clean)) {
        // Toggle OFF if already selected
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
      setToastMessage(`เพิ่ม ${clean} เข้าชุดเปรียบเทียบแล้ว (${updated.length}/4) — ดูที่แถบลอยด้านล่าง`);
      return updated;
    });
    // User remains on the current page to comfortably choose multiple countries!
  };

  const handleClearCompare = () => {
    if (!comparedList || comparedList.length === 0) return;
    setComparedList([]);
    setToastMessage('ล้างรายชื่อประเทศในชุดเปรียบเทียบทั้งหมดแล้ว');
  };

  const handleRemoveFromCompare = (countryCode) => {
    if (!countryCode) return;
    const clean = countryCode.toUpperCase();
    globalUndoStack.push({
      type: 'REMOVE_COMPARE',
      payload: clean,
      timestamp: Date.now()
    });

    setComparedList((prev) => prev.filter((c) => c && c.toUpperCase() !== clean));
    setToastMessage(`ลบประเทศ ${clean} ออกจากการเปรียบเทียบแล้ว`);
  };
  // DSA Stack Undo / Rollback Handler
  const handleUndo = () => {
    const lastAction = globalUndoStack.pop();
    if (!lastAction) return;if (lastAction.type === 'REMOVE_COMPARE') {
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
        compareCount={comparedList.length}        cacheStats={cacheStats}
      />

      {/* Main Content Area */}
      <main className="biz-main-content">
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
            onRetry={loadIndicatorData}
            onAddToCompare={handleAddToCompare}
            comparedList={comparedList}            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        )}

        {activeTab === 'inflation' && (
          <IndicatorView
            type="inflation"
            title={`ดัชนีราคาผู้บริโภคและอัตราเงินเฟ้อ Inflation Rate (CPI) ประจำปี ${selectedYear}`}
            subtitle="ติดตามเสถียรภาพระดับราคาสินค้า อัตราค่าครองชีพ และกำลังซื้อของผู้บริโภค"
            data={indicatorData}
            isLoading={isLoading}
            error={error}
            onRetry={loadIndicatorData}
            onAddToCompare={handleAddToCompare}
            comparedList={comparedList}            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        )}

        {activeTab === 'unemployment' && (
          <IndicatorView
            type="unemployment"
            title={`ดัชนีตลาดแรงงานและอัตราการว่างงาน Unemployment Rate ประจำปี ${selectedYear}`}
            subtitle="สำรวจโครงสร้างการจ้างงาน สัดส่วนประชากรในวัยทำงาน และศักยภาพตลาดแรงงาน"
            data={indicatorData}
            isLoading={isLoading}
            error={error}
            onRetry={loadIndicatorData}
            onAddToCompare={handleAddToCompare}
            comparedList={comparedList}            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
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

        {activeTab === 'health' && (
          <SystemHealthView
            selectedYear={selectedYear}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Universal Footer across ALL pages */}
      <Footer setActiveTab={setActiveTab} lenis={lenisInstance} />


      {/* In-Page Instant Comparison Modal (Zero Page Disruption) */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        comparedList={comparedList}
        setComparedList={setComparedList}
        onRemoveFromCompare={handleRemoveFromCompare}
        currentTab={activeTab}
        selectedYear={selectedYear}
        onOpenFullHub={() => {
          setActiveTab('compare');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

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
