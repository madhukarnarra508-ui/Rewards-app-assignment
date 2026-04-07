import { useEffect, useState } from "react";
import { fetchTransactions } from "../services/transactionsService";
import { NO_ERROR,createError } from "../utils/errorUtils";

/**
 * Custom React hook for fetching and managing transaction data.
 * * * This hook handles the complete lifecycle of a transaction request:
 * - Managed states for `transactions`, `isLoading`, and `error`.
 * - Prevents state updates on unmounted components using a `isMounted` flag.
 * - Integrates with custom error utilities to provide consistent error objects.
 * * @example
 * const { transactions, isLoading, error } = useTransactions();
 * * if (isLoading) return <Spinner />;
 * if (error.hasError) return <ErrorMessage message={error.message} />;
 * * @returns {Object} An object containing the current transaction state.
 * @returns {Array<Object>} returns.transactions - The list of successfully fetched transactions.
 * @returns {boolean} returns.isLoading - Boolean indicating if the fetch operation is in progress.
 * @returns {Object} returns.error - An error object containing `message`, `source`, and `details`.
 */

function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(NO_ERROR);

  useEffect(() => {
    let isMounted = true;
    const loadTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTransactions();
        if (!Array.isArray(data)) {
          throw new Error("Invalid API response format");
        }
        if (isMounted) {
          setTransactions(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            createError({
              message: "Unable to load transactions.Please try again later",
              source: "TRANSACTION_API",
              details: err.message,
            }),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadTransactions();
    return () => {
      isMounted = false;
    };
  }, []);
  return {
    transactions,
    isLoading,
    error,
  };
}

export default useTransactions;
