import React from "react";

interface TableProps {
  headers: string[];
  rows: string[][];
}

const GraphTable: React.FC<TableProps> = ({ headers, rows }) => {
  return (
    <div className="table-responsive" style={{ background: "var(--bs-body-color)" }}>
      <table className="table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="text-center px-4 py-4"
                style={{
                  background: "var(--bs-body-color)",
                  borderRadius: "3px",
                  borderStyle: "solid",
                  borderColor: "var(--bs-table-bg)",
                  borderBottomWidth: "3px",
                  borderBottomStyle: "solid",
                  color: "var(--bs-table-bg)",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="text-center px-4 py-4"
                  style={{
                    background: "var(--bs-body-color)",
                    borderRadius: "3px",
                    borderStyle: "solid",
                    borderColor: "var(--bs-table-bg)",
                    borderBottomWidth: "3px",
                    borderBottomStyle: "solid",
                    color: "var(--bs-table-bg)",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GraphTable;
