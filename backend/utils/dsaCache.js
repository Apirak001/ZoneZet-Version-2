/**
 * ============================================================================
 * DSA Implementation: In-Memory Key-Value Cache with TTL (Time-To-Live)
 * Complexity:
 *   - get(key): O(1) average time complexity
 *   - set(key, value, ttlMs): O(1)
 *   - has(key): O(1)
 *   - delete(key): O(1)
 * Role in Express Backend:
 *   - Prevents hitting World Bank API rate limits.
 *   - Reduces API response time from ~1,200ms to < 2ms for repeated requests.
 *   - Tracks cache hits/misses for transparency and monitoring.
 * ============================================================================
 */

class InMemoryCache {
  constructor(defaultTtlMs = 15 * 60 * 1000) { // Default TTL: 15 minutes
    this.store = new Map();
    this.defaultTtlMs = defaultTtlMs;
    this.hits = 0;
    this.misses = 0;
  }

  set(key, value, ttlMs = this.defaultTtlMs) {
    const expiresAt = Date.now() + ttlMs;
    this.store.set(key, { value, expiresAt });
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.value;
  }

  has(key) {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  delete(key) {
    return this.store.delete(key);
  }

  clear() {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }

  getStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? ((this.hits / total) * 100).toFixed(1) + '%' : '0%';
    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
      hitRate
    };
  }
}

module.exports = new InMemoryCache();
