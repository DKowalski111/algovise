import React from "react";

interface TableProps {
  headers: string[];
  rows: string[][];
  onRowsUpdate: (updatedRows: string[][]) => void;
}

const GraphTable: React.FC<TableProps> = ({ headers, rows, onRowsUpdate }) => {
  const handleCellChange = (rowIndex: number, cellIndex: number, newValue: string) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][cellIndex] = newValue;
    onRowsUpdate(updatedRows);
  };

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
                  <input
                    type="text"
                    value={cell}
                    className="form-control"
                    style={{
                      textAlign: "center",
                      background: "transparent",
                      color: "var(--bs-table-bg)",
                      border: "none",
                      outline: "none",
                    }}
                    onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                  />
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
