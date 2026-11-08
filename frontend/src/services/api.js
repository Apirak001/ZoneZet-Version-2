/**
 * ============================================================================
 * Centralized API Service for ZoneZet Frontend
 * Communicates with Express Backend (Proxy & Caching layer)
 * ============================================================================
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchIndicators({ type = 'gdp', year = '2025', region = '', search = '' } = {}) {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (year) params.append('year', year);
  if (region && region !== 'All') params.append('region', region);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE_URL}/indicators?${params.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error ${res.status}`);
  }
  return res.json();
}

export async function fetchDashboardSummary(year = '2025') {
  const res = await fetch(`${API_BASE_URL}/dashboard/summary?year=${year}`);
  if (!res.ok) {
    throw new Error(`Failed to load dashboard summary (HTTP ${res.status})`);
  }
  return res.json();
}

export async function fetchRegionalBenchmark(year = '2025') {
  const res = await fetch(`${API_BASE_URL}/dashboard/regional-benchmark?year=${year}`);
  if (!res.ok) {
    throw new Error(`Failed to load regional benchmark (HTTP ${res.status})`);
  }
  return res.json();
}

export async function fetchCountriesDirectory() {
  const res = await fetch(`${API_BASE_URL}/countries`);
  if (!res.ok) {
    throw new Error(`Failed to load countries directory (HTTP ${res.status})`);
  }
  return res.json();
}

export async function fetchCountryComparison({ countries = [], startYear = 2020, endYear = 2025, indicator = 'all' } = {}) {
  const params = new URLSearchParams({
    countries: countries.join(','),
    startYear: String(startYear),
    endYear: String(endYear),
    indicator
  });

  const res = await fetch(`${API_BASE_URL}/compare/countries?${params.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Comparison error ${res.status}`);
  }
  return res.json();
}

export async function fetchCacheStats() {
  const res = await fetch(`${API_BASE_URL}/cache/stats`);
  if (!res.ok) return { hits: 0, misses: 0, hitRate: '0%' };
  const json = await res.json();
  return json.stats || {};
}
