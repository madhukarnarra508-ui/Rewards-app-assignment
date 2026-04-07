import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import TransactionsTable from "../TransactionsTable";

const mockTransactions = [
  {
    transactionId: "TXN-001",
    customerName: "Emma Davis",
    purchaseDate: "2024-01-01",
    productPurchased: "Monitor",
    price: 100,
  }
];

describe("TransactionsTable Component", () => {
  const setAppliedFilters = jest.fn();
  const setErrorMessageDetails = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders transactions and formats price correctly", () => {
    render(
      <TransactionsTable 
        filteredTransactions={mockTransactions} 
        setAppliedFilters={setAppliedFilters}
        setErrorMessageDetails={setErrorMessageDetails}
      />
    );

    expect(screen.getByText("Emma Davis")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
  });

  test("shows error when applying without selecting both dates", () => {
    render(
      <TransactionsTable 
        filteredTransactions={mockTransactions} 
        setAppliedFilters={setAppliedFilters}
        setErrorMessageDetails={setErrorMessageDetails}
      />
    );

    const applyButton = screen.getByText("Apply");
    fireEvent.click(applyButton);

    expect(screen.getByText(/Please select both 'From' and 'To' dates/i)).toBeInTheDocument();
    expect(setAppliedFilters).not.toHaveBeenCalled();
  });

  test("calls setAppliedFilters with valid date range", () => {
    render(
      <TransactionsTable 
        filteredTransactions={mockTransactions} 
        setAppliedFilters={setAppliedFilters}
        setErrorMessageDetails={setErrorMessageDetails}
      />
    );

    const inputs = screen.getAllByRole("textbox"); // Or find by type="date"
    const fromInput = document.querySelector('input[type="date"]:nth-of-type(1)');
    const toInput = document.querySelector('input[type="date"]:nth-of-type(2)');

    fireEvent.change(fromInput, { target: { value: "2024-01-01" } });
    fireEvent.change(toInput, { target: { value: "2024-01-31" } });
    fireEvent.click(screen.getByText("Apply"));

    expect(setAppliedFilters).toHaveBeenCalledWith({
      start: "2024-01-01",
      end: "2024-01-31"
    });
  });

  test("clears inputs and filters on Reset", () => {
    render(
      <TransactionsTable 
        filteredTransactions={mockTransactions} 
        setAppliedFilters={setAppliedFilters}
        setErrorMessageDetails={setErrorMessageDetails}
      />
    );

    fireEvent.click(screen.getByText("Reset"));
    expect(setAppliedFilters).toHaveBeenCalledWith({ start: "", end: "" });
  });
});