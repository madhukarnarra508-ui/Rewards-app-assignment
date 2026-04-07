/**
 * Generates a stable month-year key and a human-readable display label 
 * from an ISO date string or Date object.
 * * This utility helps in grouping data by month (e.g., "2026-04") and 
 * provides a formatted string for UI components (e.g., "Apr 2026").
 *
 * @param {string|Date} isoDate - The date to be processed (ISO string or Date instance).
 * @returns {Object} An object containing the derived date components.
 * @returns {string} returns.key - A stable sortable key in 'YYYY-MM' format (e.g., "2026-04").
 * @returns {number} returns.year - The four-digit numerical year.
 * @returns {number} returns.month - The 1-based numerical month (1 for Jan, 12 for Dec).
 * @returns {string} returns.label - A localized string for UI display (e.g., "Apr 2026").
 */
export function getMonthYearKey(isoDate) {
    const date = new Date(isoDate);
    
    // Numerical year and month (month is zero-based in JS Date, so +1 is added)
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    // Stable key used for aggregation and lookups (ensures two-digit month)
    const key = `${year}-${String(month).padStart(2, '0')}`;

    // Human-readable label used directly in UI via Internationalization API
    const label = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: 'numeric',
    }).format(date);

    return { key, year, month, label };
}