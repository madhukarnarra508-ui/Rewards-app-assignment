import React, { useMemo, useState, useEffect } from "react";
import { Table as BSTable, Form, Pagination, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import "./Table.css";

/**
 * A reusable and optimized data table component built with React-Bootstrap.
 * * Features include:
 * - **Global Search:** Filters all columns based on a text input.
 * - **Column Sorting:** Supports ascending/descending toggles on header click.
 * - **Pagination:** Client-side pagination with adjustable page sizes.
 * - **Performance:** Wrapped in `React.memo` and uses `useMemo` for derived data to prevent unnecessary re-renders.
 * * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.columns - Configuration for table headers.
 * @param {string} props.columns[].key - The data property to display in this column.
 * @param {string} props.columns[].label - The text displayed in the header.
 * @param {Array<Object>} props.data - The raw array of objects to be displayed.
 * @param {number} [props.pageSize=5] - Initial number of rows per page.
 * @param {string} [props.noDataMessage] - Custom message to display when no records match filters.
 * * @returns {React.ReactElement} A responsive data table with controls.
 */

const TableComponent = React.memo(
  ({ columns, data, pageSize: initialPageSize, noDataMessage }) => {
    const [sortConfig, setSortConfig] = useState(null);
    const [filterText, setFilterText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(initialPageSize);

    // 1. Filter rows based on global search text
    const filteredData = useMemo(() => {
      if (!filterText) return data;
      return data?.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(filterText.toLowerCase()),
        ),
      );
    }, [data, filterText]);

    // 2. Sort rows based on current sort configuration
    const sortedData = useMemo(() => {
      if (!sortConfig) return filteredData;
      const { key, direction } = sortConfig;

      return [...filteredData].sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        // Check if the value is a date string (e.g., "2/11/2024")
        // and convert to a number for chronological sorting
        if (key.toLowerCase().includes("date")) {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }

        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }, [filteredData, sortConfig]);

    // Reset to page 1 whenever the filter changes
    useEffect(() => {
      setCurrentPage(1);
    }, [filterText, rowsPerPage, data]);

    // 3. Paginate sorted data
    const paginatedData = useMemo(() => {
      const startIndex = (currentPage - 1) * rowsPerPage;
      return sortedData?.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedData, currentPage, rowsPerPage]);

    // 4. Correct Total Pages calculation
    const totalPages =
      Math.ceil((filteredData?.length || 0) / rowsPerPage) || 1;

    const handleSort = (columnKey) => {
      setSortConfig((prev) =>
        prev && prev.key === columnKey
          ? {
              key: columnKey,
              direction: prev.direction === "asc" ? "desc" : "asc",
            }
          : { key: columnKey, direction: "asc" },
      );
    };

    return (
      <div className="table-wrapper">
        <Row className="mb-3 align-items-center">
          <Col xs={12} md={6}>
            <Form.Control
              type="text"
              placeholder="Search records..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </Col>
        </Row>

        <BSTable striped bordered hover responsive className="mb-0">
          <thead className="table-light">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#475569",
                    color: "#f8fafc",
                    padding: "15px 10px",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    border: "none",
                  }}
                >
                  {col.label}{" "}
                  <span style={{ marginLeft: "8px", opacity: "0.8" }}>
                    {sortConfig?.key === col.key
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : "⇅"}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={row.id || `row-${index}`}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.key.toLowerCase().includes("points") ? (
                        <span className="fw-bold">{row[col.key]}</span>
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-5 text-muted"
                >
                  {/* Uses the prop or a default if not provided */}
                  {noDataMessage || "No records found matching your criteria."}
                </td>
              </tr>
            )}
          </tbody>
        </BSTable>

        {/* Only show the footer and pagination if there is actual data to navigate */}
        {filteredData.length > 0 && (
          <Row className="mt-3 align-items-center">
            <Col xs={12} sm={6} className="d-flex align-items-center gap-2">
              <small className="text-muted">Rows:</small>
              <Form.Select
                size="sm"
                style={{ width: "auto" }}
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
              </Form.Select>
            </Col>
            <Col
              xs={12}
              sm={6}
              className="d-flex justify-content-sm-end mt-2 mt-sm-0 pagination"
            >
              <Pagination size="sm" className="mb-0">
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                />
                <Pagination.Item className="fw-bold">
                  {currentPage} / {totalPages}
                </Pagination.Item>
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                />
              </Pagination>
            </Col>
          </Row>
        )}
      </div>
    );
  },
);

TableComponent.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  initialPageSize: PropTypes.number,
};

TableComponent.defaultProps = {
  initialPageSize: 5,
};

export default TableComponent;
