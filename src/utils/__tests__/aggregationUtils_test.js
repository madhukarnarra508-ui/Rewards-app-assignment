import {
  aggregateMonthlyRewards,
  aggregateTotalRewards,
} from "../aggregationUtils";
import * as rewardCalculator from "../rewardCalculator";
import * as dateUtils from "../dateUtils";

// 1. Mock the dependencies to control the output
jest.mock("../rewardCalculator");
jest.mock("../dateUtils");

describe("Aggregation Utilities", () => {
  const mockTransactions = [
    {
      customerId: "C1",
      customerName: "John Doe",
      purchaseDate: "2023-12-01",
      price: 120,
      productPurchased: "Monitor",
    },
    {
      customerId: "C1",
      customerName: "John Doe",
      purchaseDate: "2023-12-15",
      price: 100,
      productPurchased: "Mouse",
    },
    {
      customerId: "C2",
      customerName: "Jane Smith",
      purchaseDate: "2023-11-01",
      price: 50,
      productPurchased: "Keyboard",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock for date utils to provide a consistent key structure
    dateUtils.getMonthYearKey.mockImplementation((date) => {
      const d = new Date(date);
      const month = d.getMonth();
      const year = d.getFullYear();
      return {
        key: `${month}-${year}`,
        year,
        month,
        label: "Dec 2023",
      };
    });
  });

  describe("aggregateMonthlyRewards", () => {
    it("accumulates rewards for the same customer in the same month", () => {
      // We manually set what the calculator returns to test the AGGREGATION logic
      // Transaction 1 ($120) -> returns 90 points
      // Transaction 2 ($60)  -> returns 10 points
      rewardCalculator.calculateRewards
        .mockReturnValueOnce(90)
        .mockReturnValueOnce(10);

      const aliceTransactions = [
        { customerId: "C01", customerName: "Alice", purchaseDate: "2024-01-10", price: 120 },
        { customerId: "C01", customerName: "Alice", purchaseDate: "2024-01-20", price: 60 },
      ];

      const result = aggregateMonthlyRewards(aliceTransactions);
      
      // Use Object.values to find the entry so we aren't dependent on the exact key string
      const aliceData = Object.values(result).find((item) => item.customerId === "C01");

      expect(aliceData).toBeDefined();
      expect(aliceData.rewardPoints).toBe(100); // 90 + 10
      expect(aliceData.amountSpent).toBe(180);  // 120 + 60
    });

    test("handles null or undefined transactions gracefully", () => {
      // This assumes your function returns undefined for bad input
      expect(aggregateMonthlyRewards(null)).toBeUndefined();
      expect(aggregateMonthlyRewards(undefined)).toBeUndefined();
    });

    test("correctly uses data from dateUtils and rewardCalculator", () => {
      rewardCalculator.calculateRewards.mockReturnValue(90);
      
      aggregateMonthlyRewards([mockTransactions[0]]);
      
      expect(rewardCalculator.calculateRewards).toHaveBeenCalledWith(120);
      expect(dateUtils.getMonthYearKey).toHaveBeenCalledWith("2023-12-01");
    });
  });

  describe("aggregateTotalRewards", () => {
    test("returns an array of total rewards per customer", () => {
      // For this test, we mock points to equal price for simple verification
      rewardCalculator.calculateRewards.mockImplementation((price) => price);

      const result = aggregateTotalRewards(mockTransactions);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);

      const john = result.find((r) => r.customerName === "John Doe");
      const jane = result.find((r) => r.customerName === "Jane Smith");

      // John Doe: 120 + 100 = 220 points (based on our mock)
      expect(john.rewardPoints).toBe(220);
      // Jane Smith: 50 points (based on our mock)
      expect(jane.rewardPoints).toBe(50);
    });

    test("handles empty transaction array", () => {
      const result = aggregateTotalRewards([]);
      expect(result).toEqual([]);
    });

    test("handles null input by defaulting to empty array", () => {
      const result = aggregateTotalRewards(null);
      expect(result).toEqual([]);
    });
  });
});