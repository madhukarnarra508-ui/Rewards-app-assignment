import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { aggregateMonthlyRewards } from "../../utils/aggregationUtils";
import TableComponent from "../common/TableComponent";

/**
 * MonthlyRewardsTable Component
 * * This component acts as a data wrapper that transforms raw transaction data
 * into a monthly aggregated format suitable for display in the generic Table component.
 * - Invokes `aggregateMonthlyRewards` to group transactions by customer and month.
 * - Sorts aggregated data chronologically (Year, then Month).
 * - Maps the data to include unique keys and formatted strings (e.g., `toFixed(2)` for currency).
 * - Defines column configurations specifically for the Monthly Rewards view.
 * * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.transactions - The raw list of all customer transactions.
 * @returns {React.ReactElement} A memoized table showing rewards aggregated by month.
 */

const MonthlyRewardsTable = ({ transactions, noDataMessage }) => {
  const data = useMemo(() => {
    //Group transactions into monthly using the utility function.
    const aggregatedData = aggregateMonthlyRewards(transactions);

    //Convert the object of objects into an array, sort it, and format for the Table.
    return (
      Object.values(aggregatedData)
        // Sort primarily by Year, then by Month (numerical index).
        .sort((a, b) => a.year - b.year || a.month - b.month)
        .map((item) => ({
          // Create a unique ID for React keys by combining user ID and date info.
          id: `${item?.customerId}-${item?.year}-${item?.month}`,
          customerId: item?.customerId,
          customer: item?.customerName,
          year: item?.yearLabel,
          product: item?.productPurchased,
          price: item?.price,
          points: item?.rewardPoints,
          date: item?.date,
          amountSpent: `$${item?.amountSpent.toFixed(2)}`,
        }))
    );
  }, [transactions]); // only re-calculate if 'transactions' changes.

  // Define the table headers.
  const columns = [
    { key: "customerId", label: "CustomerId" },
    { key: "customer", label: "Name" },
    { key: "year", label: "Year" },
    { key: "amountSpent", label: "Amount Spent ($)" },
    { key: "points", label: "Reward Points" },
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
};

// Ensure the parent component provides an array to avoid crashes.
MonthlyRewardsTable.propTypes = {
  transactions: PropTypes.array.isRequired,
  noDataMessage:PropTypes.string
};

export default MonthlyRewardsTable;
