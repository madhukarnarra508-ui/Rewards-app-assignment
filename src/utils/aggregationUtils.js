/**
 * @fileoverview Utility functions for aggregating customer reward data.
 */

import { getMonthYearKey } from "./dateUtils";
import { calculateRewards } from "./rewardCalculator";

/**
 * Aggregates reward points and spending on a monthly basis for each customer.
 * * This function uses a composite key (`customerId-monthKey`) to group transactions
 * by customer and month, calculating cumulative points and total spending.
 *
 * @param {Array<Object>} transactions - The array of transaction objects.
 * @param {string} transactions[].customerId - Unique identifier for the customer.
 * @param {string} transactions[].customerName - Name of the customer.
 * @param {string} transactions[].purchaseDate - ISO or valid date string of the transaction.
 * @param {number} transactions[].price - The transaction amount.
 * @param {string} transactions[].productPurchased - Name of the product bought.
 * @returns {Object} An object where keys are composite IDs and values are monthly aggregates.
 */
export function aggregateMonthlyRewards(transactions) {
  return transactions?.reduce((accumulator, transaction) => {
    const { customerId, customerName, purchaseDate, price, productPurchased } =
      transaction;

    // compute reward points for the transaction
    const rewardPoints = calculateRewards(price);

    // Derive month/year information
    const { key, year, month, label } = getMonthYearKey(purchaseDate);

    const date = new Date(purchaseDate).toLocaleDateString();

    // Composite key ensures uniqueness per customer per month
    const aggregateKey = `${customerId}-${key}`;
    
    // Initialize aggregation Object if not present
    if (!accumulator[aggregateKey]) {
      accumulator[aggregateKey] = {
        customerId,
        customerName,
        year,
        month,
        yearLabel: label,
        rewardPoints: 0,
        date,
        productPurchased,
        price,
        amountSpent: 0,
      };
    }

    // Accumulate reward points and total spent
    accumulator[aggregateKey].rewardPoints += rewardPoints;
    accumulator[aggregateKey].amountSpent  += price;
    
    return accumulator;
  }, {});
}

/**
 * Aggregates total reward points and total spending per customer across all time.
 * * Groups all provided transactions by customer ID and returns a flattened array
 * of total rewards and total expenditure per customer.
 *
 * @param {Array<Object>} transactions - The array of transaction objects.
 * @param {string} transactions[].customerId - Unique identifier for the customer.
 * @param {string} transactions[].customerName - Name of the customer.
 * @param {number} transactions[].price - The transaction amount.
 * @returns {Array<Object>} A flattened array of objects containing total rewards per customer.
 */
export function aggregateTotalRewards(transactions) {
  const aggregatedMap = (transactions || []).reduce(
    (accumulator, transaction) => {
      const { customerName, price, customerId } = transaction;

      // Calculate rewards for each transaction
      const rewardPoints = calculateRewards(price);

      // Initialize customer aggregation Object if not present
      if (!accumulator[customerId]) {
        accumulator[customerId] = {
          customerId,
          customerName,
          rewardPoints: 0,
          totalSpent: 0,
        };
      }

      // Accumulate reward points and total spent
      accumulator[customerId].rewardPoints += rewardPoints;
      accumulator[customerId].totalSpent += price;
      
      return accumulator;
    },
    {},
  );

  // Convert the Object map into a flat Array for UI consumption
  return Object.values(aggregatedMap);
}