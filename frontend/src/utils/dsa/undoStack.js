/**
 * ============================================================================
 * DSA Implementation: Stack (LIFO - Last In, First Out)
 * Complexity:
 *   - push(item): O(1)
 *   - pop(): O(1)
 *   - peek(): O(1)
 *   - isEmpty(): O(1)
 *   - size(): O(1)
 * UX Role:
 *   - Powers the Undo/Rollback mechanism when users remove countries from Watchlist or Compare Hub.
 *   - Forgiveness Principle (Nielsen Norman UX Heuristics): Prevents accidental data loss.
 * ============================================================================
 */

export class UndoStack {
  constructor(maxCapacity = 30) {
    this.items = [];
    this.maxCapacity = maxCapacity;
  }

  push(action) {
    // action: { type: 'REMOVE_WATCHLIST' | 'REMOVE_COMPARE', payload: {...}, timestamp: Date.now() }
    if (this.items.length >= this.maxCapacity) {
      this.items.shift(); // Evict oldest
    }
    this.items.push(action);
  }

  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
}

export const globalUndoStack = new UndoStack();
