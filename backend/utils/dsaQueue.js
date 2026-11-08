/**
 * ============================================================================
 * DSA Implementation: Queue (FIFO - First In, First Out)
 * Complexity:
 *   - enqueue(item): O(1)
 *   - dequeue(): O(1) with pointer-based head or array slice
 *   - peek(): O(1)
 *   - isEmpty(): O(1)
 *   - size(): O(1)
 * Role in Express Backend:
 *   - Request Task Queue: Sequences batch requests sent to external World Bank API.
 *   - Prevents overwhelming external API servers and avoids HTTP 429 Too Many Requests.
 * ============================================================================
 */

class TaskQueue {
  constructor() {
    this.items = [];
    this.head = 0;
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    const item = this.items[this.head];
    this.head++;

    // Clean up memory when head reaches halfway through array
    if (this.head > 100 && this.head > this.items.length / 2) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }

    return item;
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.head];
  }

  isEmpty() {
    return this.head >= this.items.length;
  }

  size() {
    return this.items.length - this.head;
  }

  clear() {
    this.items = [];
    this.head = 0;
  }
}

module.exports = TaskQueue;
