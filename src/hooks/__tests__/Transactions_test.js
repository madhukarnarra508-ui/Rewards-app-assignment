import { renderHook, waitFor } from '@testing-library/react';
import useTransactions from '../useTransactions';

// 1. Mock the fetch globally
global.fetch = jest.fn();

describe('useTransactions hook', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should fetch and return transactions', async () => {
    // 2. Setup the mock response properly
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        {
          transactionId: "T1",
          customerId: "C1",
          customerName: "Sarah Wilson",
          price: 120,
          purchaseDate: "2024-01-15",
        },
      ]),
    });

    const { result } = renderHook(() => useTransactions());

    // 3. Wait for the loading to stop
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // 4. Validate results
    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].customerName).toBe('Sarah Wilson');
    expect(result.current.error.hasError).toBe(false);
  });
});