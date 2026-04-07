import React, { useMemo } from "react";
import { aggregateTotalRewards } from "../../utils/aggregationUtils";
import TableComponent from "../common/TableComponent";

/**
 * TotalRewardsTable Component
 * * Provides a high-level summary of total reward points earned per customer.
 * - Aggregates points across all transactions and all months using `aggregateTotalRewards`.
 * - Transforms the aggregated map into a flat array compatible with the generic `Table` component.
 * - Formats currency values (total spent) to two decimal places for UI consistency.
 * - Memoizes data to ensure calculations only re-run when the `transactions` array changes.
 * * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.transactions - The raw source array of all customer transactions.
 * @returns {React.ReactElement} A memoized table displaying total customer loyalty metrics.
 */

function TotalRewardsTable({ transactions, noDataMessage }) {
  // Derived data is memoized to avoid unnecessary recalculations.

  const data = useMemo(() => {
    const aggregated = aggregateTotalRewards(transactions);
    return Object.values(aggregated)?.map((item) => ({
      customerId: item?.customerId, //stable unique identifier
      customerName: item?.customerName,
      rewardPoints: item?.rewardPoints,
      totalSpent: `$${item?.totalSpent.toFixed(2)}`, // Format to 2 decimal places
    }));
  }, [transactions]);

  const columns = [
    { key: "customerId", label: "Customer ID" },
    { key: "customerName", label: "Customer Name" },
    { key: "totalSpent", label: "Total Spent ($)" },
    { key: "rewardPoints", label: "Total Reward Points" },
  ];
  return (
    <>
      <TableComponent
        columns={columns}
        data={data}
        pageSize={5}
        noDataMessage={noDataMessage}
      />
    </>
  );
}

export default TotalRewardsTable;
