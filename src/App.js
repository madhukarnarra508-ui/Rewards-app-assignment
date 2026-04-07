import React from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import useTransactions from "./hooks/useTransactions";
import RewardsContainer from "./components/RewardsContainer";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  const { transactions, isLoading, error } = useTransactions();

  return (
    <Container className="py-5">
      <header className="mb-5 text-center px-3">
        <h1
          className="display-5 fw-extra-bold mb-2"
          style={{ color: "#0f172a", letterSpacing: "-1.5px" }}
        >
          Customer <span style={{color:"#475569"}}>Rewards</span> Program
        </h1>

        <p
          className="lead text-muted mx-auto"
          style={{ maxWidth: "600px", fontSize: "1.1rem" }}
        >
          Track transaction history, calculate points, and analyze
          monthly distributions.
        </p>
      </header>
      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading customer data...</p>
        </div>
      ) : error?.hasError ? (
        <Alert variant="danger">{error.message}</Alert>
      ) : (
        /* The ErrorBoundary now protects the entire Rewards logic unit */
        <ErrorBoundary>
          <RewardsContainer transactions={transactions} />
        </ErrorBoundary>
      )}
    </Container>
  );
}

export default App;
