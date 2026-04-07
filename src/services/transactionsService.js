import logger from "../utils/logger";

/**
 * Fetches transaction data from a local mock JSON endpoint.
 * * This function performs an asynchronous fetch request, validates the
 * HTTP response status, and ensures the returned payload is an array.
 * If an error occurs, it is logged via the custom logger utility.
 */
export const fetchTransactions = async () => {
  try {
    const response = await fetch("/mock/mocktransactions.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error(`Invalid transactions payload`);
    }
    return data;
  } catch (err) {
    logger.error("Transaction fetch failed", { error: err.message });
  }
};
