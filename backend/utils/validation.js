/**
 * ============================================================================
 * Express Middleware: Input Validation & Sanitization
 * Role:
 *   - Validates query parameters before querying the World Bank API.
 *   - Prevents invalid indicator types, out-of-range years, and malformed country codes.
 *   - Rejects harmful inputs and returns clear structured JSON error messages.
 * ============================================================================
 */

const ALLOWED_INDICATORS = ['gdp', 'inflation', 'unemployment'];
const MIN_YEAR = 1990;
const MAX_YEAR = 2026;

function validateIndicatorParams(req, res, next) {
  const type = (req.query.type || 'gdp').toLowerCase().trim();
  const year = req.query.year ? parseInt(req.query.year, 10) : 2025;
  const search = req.query.search ? String(req.query.search).trim() : '';

  // 1. Validate Indicator Type
  if (!ALLOWED_INDICATORS.includes(type)) {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_INDICATOR_TYPE',
      message: `Invalid indicator type "${type}". Allowed values are: ${ALLOWED_INDICATORS.join(', ')}`
    });
  }

  // 2. Validate Year
  if (isNaN(year) || year < MIN_YEAR || year > MAX_YEAR) {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_YEAR',
      message: `Year must be an integer between ${MIN_YEAR} and ${MAX_YEAR}. Received: ${req.query.year}`
    });
  }

  // 3. Sanitize Search Query
  if (search.length > 60) {
    return res.status(400).json({
      status: 'error',
      code: 'SEARCH_TOO_LONG',
      message: 'Search keyword must not exceed 60 characters.'
    });
  }

  // Attach normalized parameters to request
  req.validated = {
    type,
    year: String(year),
    search
  };

  next();
}

function validateComparisonParams(req, res, next) {
  const { countries, indicator, startYear, endYear } = req.query;

  if (!countries) {
    return res.status(400).json({
      status: 'error',
      code: 'MISSING_COUNTRIES',
      message: 'Parameter "countries" is required (comma-separated ISO3 or ISO2 codes, e.g., THA,USA,JPN).'
    });
  }

  const countryList = countries
    .split(',')
    .map(c => c.trim().toUpperCase())
    .filter(Boolean);

  if (countryList.length === 0 || countryList.length > 6) {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_COUNTRY_COUNT',
      message: 'You can compare between 1 and 6 countries at a time.'
    });
  }

  // Validate start & end year if provided
  const sYear = startYear ? parseInt(startYear, 10) : 2020;
  const eYear = endYear ? parseInt(endYear, 10) : 2025;

  if (isNaN(sYear) || isNaN(eYear) || sYear > eYear || sYear < MIN_YEAR || eYear > MAX_YEAR) {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_YEAR_RANGE',
      message: `Year range must be between ${MIN_YEAR} and ${MAX_YEAR}, and startYear <= endYear.`
    });
  }

  req.validatedCompare = {
    countries: countryList,
    indicator: indicator ? indicator.toLowerCase().trim() : 'all',
    startYear: sYear,
    endYear: eYear
  };

  next();
}

module.exports = {
  validateIndicatorParams,
  validateComparisonParams,
  ALLOWED_INDICATORS
};
