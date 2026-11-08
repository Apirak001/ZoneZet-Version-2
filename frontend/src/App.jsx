import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardHome from './components/DashboardHome';
import IndicatorView from './components/IndicatorView';
import ComparisonHub from './components/ComparisonHub';
import WatchlistRecordView from './components/WatchlistRecordView';
import UndoToast from './components/UndoToast';
import { fetchIndicators, fetchDashboardSummary, fetchCacheStats } from './services/api';
import { globalUndoStack } from './utils/dsa/undoStack';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data States
  const [topSummary, setTopSummary] = useState({});
  const [indicatorData, setIndicatorData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0, hitRate: '100%' });

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
      // Refresh cache stats
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
      return;
    }
    if (comparedList.length >= 5) {
      alert('สามารถเปรียบเทียบพร้อมกันได้สูงสุด 5 ประเทศ');
      return;
    }
    setComparedList([...comparedList, clean]);
    setActiveTab('compare');
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
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        compareCount={comparedList.length}
        watchlistCount={watchlist.length}
      />

      {/* Main Workspace Area */}
      <div className="main-area">
        <Header
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />

        <main className="content-body">
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
              title={`อัตราเติบโตทางเศรษฐกิจ GDP Growth (%) ประจำปี ${selectedYear}`}
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
              title={`อัตราเงินเฟ้อ Inflation Rate (%) ประจำปี ${selectedYear}`}
              subtitle="วัดการเปลี่ยนแปลงของดัชนีราคาผู้บริโภค CPI (World Bank Code: FP.CPI.TOTL.ZG)"
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
              title={`อัตราการว่างงาน Unemployment (%) ประจำปี ${selectedYear}`}
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
                }
              }}
              setActiveTab={setActiveTab}
            />
          )}
        </main>
      </div>

      {/* Floating Undo Banner */}
      <UndoToast
        message={toastMessage}
        onUndo={handleUndo}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
