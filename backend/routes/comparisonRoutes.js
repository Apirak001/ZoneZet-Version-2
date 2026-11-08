/**
 * ============================================================================
 * Routes: Comparison & Country Directory Routes
 * Endpoints:
 *   - GET /api/compare/countries: Multi-country, multi-year comparison (2020-2025)
 *   - GET /api/countries: Directory of all available countries for search/select
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const worldBankService = require('../services/worldBankService');
const { validateComparisonParams } = require('../utils/validation');

// 1. Multi-Country Comparison Hub (Powers Recharts interactive chart & compare cards)
router.get('/compare/countries', validateComparisonParams, async (req, res) => {
  try {
    const { countries, startYear, endYear } = req.validatedCompare;

    const comparisonData = await worldBankService.compareCountries(
      countries,
      startYear,
      endYear
    );

    res.json({
      status: 'success',
      comparedCountries: countries,
      startYear,
      endYear,
      data: comparisonData
    });
  } catch (error) {
    console.error('[comparisonRoutes] Error comparing countries:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate country comparison.',
      error: error.message
    });
  }
});

// 2. Directory of Countries (with flags, iso2, regions)
router.get('/countries', async (req, res) => {
  try {
    const countries = await worldBankService.getAvailableCountries();
    res.json({
      status: 'success',
      total: countries.length,
      data: countries
    });
  } catch (error) {
    console.error('[comparisonRoutes /countries] Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve country directory.'
    });
  }
});

module.exports = router;
