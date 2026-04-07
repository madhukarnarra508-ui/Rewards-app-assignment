import { useState, useMemo } from "react";
import { Row, Col, Card } from "react-bootstrap";
import TransactionsTable from "./Transactions/TransactionsTable";
import MonthlyRewardsTable from "./MonthlyRewards/MonthlyRewardsTable";
import TotalRewardsTable from "./TotalRewards/TotalRewardsTable";

const RewardsContainer = ({ transactions }) => {
  const [appliedFilters, setAppliedFilters] = useState({ start: "", end: "" });
  const [errorMessageDetails, setErrorMessageDetails] = useState({});

  const { startInput, endInput, dateRangeMessage } = errorMessageDetails;
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      if (!txn?.purchaseDate) return false;

      const txnTime = new Date(txn.purchaseDate).getTime();

      if (appliedFilters.start) {
        const start = new Date(appliedFilters.start).getTime();
        if (txnTime < start) return false;
      }

      if (appliedFilters.end) {
        const end = new Date(appliedFilters.end);
        end.setHours(23, 59, 59, 999);
        if (txnTime > end.getTime()) return false;
      }

      return true;
    });
  }, [transactions, appliedFilters]);

  return (
    <Row className="g-4">
      {/* 1. Transactions Table (Controls the filter) */}
      <Col xs={12}>
        <Card className="shadow-sm border-0">
          <Card.Body>
            <TransactionsTable
              filteredTransactions={filteredTransactions}
              setAppliedFilters={setAppliedFilters}
              setErrorMessageDetails={setErrorMessageDetails}
            />
          </Card.Body>
        </Card>
      </Col>

      {/* 2. Monthly Rewards (Receives filtered data) */}
      <Col md={12}>
        <Card className="shadow-sm border-0 h-100">
          <Card.Header className="bg-white py-3">
            <h5 className="mb-0 fw-bold">User Monthly Rewards</h5>
          </Card.Header>
          <Card.Body>
            <MonthlyRewardsTable
              transactions={filteredTransactions}
              noDataMessage={
                startInput || endInput
                  ? dateRangeMessage
                  : "No records found matching your criteria."
              }
            />
          </Card.Body>
        </Card>
      </Col>

      {/* 3. Total Rewards (Receives filtered data) */}
      <Col md={12}>
        <Card className="shadow-sm border-0 h-100">
          <Card.Header className="bg-white py-3">
            <h5 className="mb-0 fw-bold">Total Rewards Summary</h5>
          </Card.Header>
          <Card.Body>
            <TotalRewardsTable
              transactions={filteredTransactions}
              noDataMessage={
                startInput || endInput
                  ? dateRangeMessage
                  : "No records found matching your criteria."
              }
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default RewardsContainer;
