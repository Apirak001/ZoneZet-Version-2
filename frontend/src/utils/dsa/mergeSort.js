/**
 * ============================================================================
 * DSA Implementation: Merge Sort (Divide & Conquer)
 * Complexity:
 *   - Best Case: O(n log n)
 *   - Average Case: O(n log n)
 *   - Worst Case: O(n log n)
 *   - Space Complexity: O(n) (Stable sort)
 * Comparison with Version 1 (Bubble Sort):
 *   - V.1 Bubble Sort was O(n^2). For 200 countries, ~40,000 comparisons.
 *   - V.2 Merge Sort is O(n log n). For 200 countries, ~1,500 operations (>25x faster).
 *   - Guarantees immediate UI responsiveness on user sort/filter interaction.
 * ============================================================================
 */

function merge(left, right, key, direction = 'desc') {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    let comparison = 0;
    const aVal = left[i][key];
    const bVal = right[j][key];

    if (typeof aVal === 'string') {
      comparison = aVal.localeCompare(bVal);
    } else {
      comparison = (aVal || 0) - (bVal || 0);
    }

    const shouldPickLeft = direction === 'asc' ? comparison <= 0 : comparison >= 0;

    if (shouldPickLeft) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  while (i < left.length) {
    result.push(left[i]);
    i++;
  }
  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
}

export function mergeSort(array, key = 'value', direction = 'desc') {
  if (!Array.isArray(array) || array.length <= 1) {
    return array;
  }

  const mid = Math.floor(array.length / 2);
  const left = mergeSort(array.slice(0, mid), key, direction);
  const right = mergeSort(array.slice(mid), key, direction);

  return merge(left, right, key, direction);
}
