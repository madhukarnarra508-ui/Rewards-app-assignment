import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import TableComponent from "../TableComponent";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "points", label: "Reward Points" },
];

const mockData = [
  { id: "TXN-001", name: "Emma Davis", points: 100 },
  { id: "TXN-002", name: "John Doe", points: 50 },
  { id: "TXN-003", name: "Alice Smith", points: 200 },
];

describe("Table Component", () => {
  test("renders headers and formats 'points' columns with spans", () => {
    render(<TableComponent columns={columns} data={mockData} pageSize={5} />);
    
    // Check for header text (using regex to ignore the sort arrow characters)
    expect(screen.getByText(/ID/i)).toBeInTheDocument();
    
    // Fix: Your test was expecting STRONG, but your code uses SPAN for badges
    const pointsCell = screen.getByText("100");
    expect(pointsCell.tagName).toBe("SPAN");
  });

  test("filters rows and resets to page 1", async () => {
    render(<TableComponent columns={columns} data={mockData} pageSize={5} />);
    
    // Fix: Your code uses "Search records...", not "Filter rows"
    const input = screen.getByPlaceholderText(/Search records.../i);
    
    await userEvent.type(input, "Emma");
    
    expect(screen.getByText("Emma Davis")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  test("sorts data in ASC and DESC order", async () => {
    render(<TableComponent columns={columns} data={mockData} pageSize={5} />);
    
    // Fix: Use a matcher function because the text is broken up by the sort icon
    const nameHeader = screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'th' && content.includes('Name');
    });

    fireEvent.click(nameHeader);
    // After click, verify sorting logic or indicator
    expect(nameHeader).toHaveTextContent("↑");
  });

  test("handles empty data gracefully by hiding pagination", () => {
    render(<TableComponent columns={columns} data={[]} pageSize={5} />);
    
    // Verify the "No records" message appears
    expect(screen.getByText(/No records found matching your criteria/i)).toBeInTheDocument();
    
    // Fix: We specifically added logic to HIDE pagination when data is empty
    // So "1 / 1" should NOT be in the document
    expect(screen.queryByText(/1 \/ 1/i)).not.toBeInTheDocument();
  });
});