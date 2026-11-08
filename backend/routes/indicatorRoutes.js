/**
 * ============================================================================
 * Routes: Indicator Routes
 * Endpoints:
 *   - GET /api/indicators: Fetch economic indicators (GDP, Inflation, Unemployment)
 *   - GET /api/dashboard/summary: Top 5 highlights for overview
 *   - GET /api/cache/stats: Live In-memory cache analytics
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const worldBankService = require('../services/worldBankService');
const { validateIndicatorParams } = require('../utils/validation');
const cache = require('../utils/dsaCache');

// 1. Fetch Indicators with Validation & Search Filtering
router.get('/indicators', validateIndicatorParams, async (req, res) => {
  try {
    const { type, year, search } = req.validated;
    const region = req.query.region ? req.query.region.trim() : '';

    const rawData = await worldBankService.fetchIndicatorData(type, year);

    let filtered = rawData;

    // Filter by Region if provided
    if (region && region !== 'All') {
      filtered = filtered.filter(item =>
        item.region && item.region.toLowerCase() === region.toLowerCase()
      );
    }

    // Filter by Search Query
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(item =>
        item.country.toLowerCase().includes(q) ||
        (item.countryCode && item.countryCode.toLowerCase().includes(q)) ||
        (item.region && item.region.toLowerCase().includes(q))
      );
    }

    res.json({
      status: 'success',
      type,
      year,
      region: region || 'All',
      search: search || null,
      total: filtered.length,
      data: filtered
    });
  } catch (error) {
    console.error('[indicatorRoutes] Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve indicator data.',
      error: error.message
    });
  }
});

// 2. Dashboard Top Highlights
router.get('/dashboard/summary', async (req, res) => {
  try {
    const year = req.query.year || '2025';
    const data = await worldBankService.fetchTopHighlights(year);
    res.json({
      status: 'success',
      year,
      data,
      cacheStats: cache.getStats()
    });
  } catch (error) {
    console.error('[indicatorRoutes /summary] Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve dashboard summary.'
    });
  }
});

// 3. Dashboard Regional Macro Benchmark
router.get('/dashboard/regional-benchmark', async (req, res) => {
  try {
    const year = req.query.year || '2025';
    const data = await worldBankService.fetchRegionalBenchmark(year);
    res.json({
      status: 'success',
      data,
      cacheStats: cache.getStats()
    });
  } catch (error) {
    console.error('[indicatorRoutes /dashboard/regional-benchmark] Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve regional benchmark.'
    });
  }
});

// 3. DSA Cache Analytics (For verification & presentation demo)
router.get('/cache/stats', (req, res) => {
  res.json({
    status: 'success',
    stats: cache.getStats()
  });
});

module.exports = router;
