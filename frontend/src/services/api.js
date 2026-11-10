/**
 * ============================================================================
 * Centralized API Service for ZoneZet Frontend
 * Communicates with Express Backend (Proxy & Caching layer)
 * Enhanced with Client-Side In-Memory SWR Cache & In-Flight Request Deduplication
 * ============================================================================
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Client-side memory cache & in-flight deduplication map (client-swr-dedup)
const responseCache = new Map();
const inflightRequests = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes client cache TTL

async function fetchWithCache(url, { signal, ttl = CACHE_TTL_MS, bypassCache = false } = {}) {
  const now = Date.now();

  if (!bypassCache && responseCache.has(url)) {
    const cached = responseCache.get(url);
    if (now - cached.timestamp < ttl) {
      return cached.data;
    }
  }

  // Deduplicate concurrent identical requests when no custom abort signal is used
  if (!signal && inflightRequests.has(url)) {
    return inflightRequests.get(url);
  }

  const requestPromise = (async () => {
    try {
      const res = await fetch(url, signal ? { signal } : undefined);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error ${res.status}`);
      }
      const data = await res.json();
      responseCache.set(url, { data, timestamp: Date.now() });
      return data;
    } finally {
      inflightRequests.delete(url);
    }
  })();

  if (!signal) {
    inflightRequests.set(url, requestPromise);
  }

  return requestPromise;
}

export async function fetchIndicators({ type = 'gdp', year = '2025', region = '', search = '', signal } = {}) {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (year) params.append('year', year);
  if (region && region !== 'All') params.append('region', region);
  if (search) params.append('search', search);

  const url = `${API_BASE_URL}/indicators?${params.toString()}`;
  return fetchWithCache(url, { signal });
}

export async function fetchDashboardSummary(year = '2025', { signal } = {}) {
  const url = `${API_BASE_URL}/dashboard/summary?year=${year}`;
  return fetchWithCache(url, { signal });
}

export async function fetchRegionalBenchmark(year = '2025', { signal } = {}) {
  const url = `${API_BASE_URL}/dashboard/regional-benchmark?year=${year}`;
  return fetchWithCache(url, { signal });
}

export async function fetchCountriesDirectory({ signal } = {}) {
  const url = `${API_BASE_URL}/countries`;
  return fetchWithCache(url, { signal, ttl: 15 * 60 * 1000 });
}

export async function fetchCountryComparison({ countries = [], startYear = 2020, endYear = 2025, indicator = 'all', signal } = {}) {
  const normalizedCountries = [...countries].map(c => c.toUpperCase());
  const params = new URLSearchParams({
    countries: normalizedCountries.join(','),
    startYear: String(startYear),
    endYear: String(endYear),
    indicator
  });

  const url = `${API_BASE_URL}/compare/countries?${params.toString()}`;
  return fetchWithCache(url, { signal });
}

export async function fetchCacheStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/cache/stats`);
    if (!res.ok) return { hits: 0, misses: 0, hitRate: '0%' };
    const json = await res.json();
    return json.stats || {};
  } catch {
    return { hits: 0, misses: 0, hitRate: '100%' };
  }
}
