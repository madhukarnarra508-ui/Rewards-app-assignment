/**
 * Calculates reward points based on a tiered purchase amount.
 * * The reward logic follows these rules:
 * - 2 points for every dollar spent over $100.
 * - 1 point for every dollar spent between $50 and $100.
 * - 0 points for dollars spent below $50.
 * * @example
 * // Returns 90 (50 points for the $50-$100 range + 40 points for the $20 over $100)
 * calculateRewards(120); 
 * * @param {number} amount - The total purchase amount to calculate rewards for.
 * @returns {number} The total accumulated reward points, rounded down to the nearest integer.
 * @throws {Error} Throws an error if the provided amount is not a finite number.
 */
export function calculateRewards(amount) {

    if (!Number.isFinite(amount)) {
        throw new Error('Invalid amount passed to reward calculator');
    }

    // Amounts <= $50 earn no rewards
    if (amount <= 50) return 0;

    // If amount is between $50 and $100:
    // Reward only the portion above $50 (1 point per dollar)
    if (amount <= 100) {
        return Math.floor(amount - 50);
    }

    // If amount is greater than $100:
    // 1. Fixed 50 points for the first $50-$100 range.
    // 2. 2 points per dollar for the portion above $100.
    return 50 + Math.floor(amount - 100) * 2;
}