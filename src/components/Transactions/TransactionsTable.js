import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { calculateRewards } from "../../utils/rewardCalculator";
import TableComponent from "../common/TableComponent";
import "./TransactionTable.css";
import { Card } from "react-bootstrap";

/**
 * TransactionsTable Component
 * A table component that displays raw transaction data with built-in date range filtering and validation.
 * - **Date Range Filtering:** Users can filter transactions between "From" and "To" dates.
 * - **Input Validation:** Ensures both dates are selected and that the start date is not after the end date.
 * - **Reward Integration:** Automatically calculates reward points for each transaction row.
 * - **State Management:** Decouples input state (`startInput`) from applied filter state (`appliedFilters`) to trigger updates only on button click.
 * * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.transactions - The raw array of transaction objects from the API/mock.
 * @returns {React.ReactElement} A card-wrapped table with date filter controls.
 */

function TransactionsTable({
  filteredTransactions,
  setAppliedFilters,
  setErrorMessageDetails,
}) {
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleApply = () => {
    // 1. New Validation: Check if dates are missing
    if (!startInput || !endInput) {
      setErrorMessage("Please select both 'From' and 'To' dates.");
      return;
    }

    // 2. Logic Validation: Check if Start is after End
    if (new Date(startInput) > new Date(endInput)) {
      setErrorMessage("End date cannot be before start date.");
      return;
    }

    setErrorMessage("");
    setAppliedFilters({ start: startInput, end: endInput });
  };

  const handleReset = () => {
    setStartInput("");
    setEndInput("");
    setAppliedFilters({ start: "", end: "" });
    setErrorMessage("");
  };

 const data = useMemo(() => {
  // 1. Sort the raw transactions by date first
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    return new Date(a.purchaseDate) - new Date(b.purchaseDate);
  });

  // 2. Map the sorted transactions to your table rows
  return sortedTransactions.map((txn) => ({
    id: txn?.transactionId,
    transactionId: txn?.transactionId,
    customerName: txn?.customerName,
    purchaseDate: new Date(txn.purchaseDate).toLocaleDateString(), // Format for display
    product: txn.productPurchased,
    price: `$${txn.price}`,
    rewardPoints: calculateRewards(txn.price),
  }));
}, [filteredTransactions]);

  const columns = [
    { key: "transactionId", label: "Id" },
    { key: "customerName", label: "Customer" },
    { key: "purchaseDate", label: "Date (mm/dd/yyyy)" },
    { key: "product", label: "Product" },
    { key: "price", label: "Price ($)" },
    { key: "rewardPoints", label: "Points" },
  ];

  const dateRangeMessage = `No transactions found between ${startInput} and ${endInput}`;
  useEffect(() => {
    setErrorMessageDetails({
      startInput,
      endInput,
      dateRangeMessage,
    });
  }, [startInput, endInput, dateRangeMessage, setErrorMessageDetails]);

  return (
    <div className="transactions-container">
      <div className="table-header">
        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center flex-wrap border-0 shadow-none">
          {/* Left Side: Title */}
          <h5 className="mb-0 fw-bold text-dark" style={{ border: "none" }}>
            Transactions
          </h5>

          {/* Right Side: Filters */}
          <div className="filter-wrapper position-relative">
            <div className="d-flex align-items-center gap-2 bg-white p-2 rounded-3 shadow-sm border">
              <input
                type="date"
                className="form-control form-control-sm border-0 bg-light"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
              />
              <span className="text-muted">→</span>
              <input
                type="date"
                className="form-control form-control-sm border-0 bg-light"
                value={endInput}
                onChange={(e) => setEndInput(e.target.value)}
              />
              <button
                className="btn btn-sm px-3 fw-semibold"
                style={{
                    backgroundColor: "#475569",
                    color: "#f8fafc",
                  }}
                onClick={handleApply}
              >
                Apply
              </button>
              <button
                className="btn btn-link btn-sm text-muted text-decoration-none"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
            {/* Error Message Tooltip */}
            {errorMessage && (
              <span
                className="error-tooltip bg-danger text-white px-2 py-1 rounded small position-absolute"
                style={{
                  top: "80%",
                  right: "0",
                  zIndex: 10,
                  fontSize: "11px",
                }}
              >
                {errorMessage}
              </span>
            )}
          </div>
        </Card.Header>
      </div>
      <Card.Body>
        <TableComponent
          columns={columns}
          data={data}
          noDataMessage={
            startInput || endInput
              ? dateRangeMessage
              : "No records found matching your criteria."
          }
          pageSize={5}
        />
      </Card.Body>
    </div>
  );
}

TransactionsTable.propTypes = {
  filteredTransactions: PropTypes.array.isRequired,
  setAppliedFilters: PropTypes.func.isRequired,
  setErrorMessageDetails: PropTypes.func.isRequired,
};

export default TransactionsTable;
