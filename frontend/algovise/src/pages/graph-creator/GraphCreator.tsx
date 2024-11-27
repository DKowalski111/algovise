import React, { useState } from "react";
import GraphVisualizer from "./components/GraphVisualiser";
import GraphTable from "./components/GraphTable";

const graphData = {
  nodes: [
    { id: 0, label: "A" },
    { id: 1, label: "B" },
    { id: 2, label: "C" },
    { id: 3, label: "D" },
    { id: 4, label: "E" },
  ],
  edges: [
    { source: 0, target: 1, weight: 2 },
    { source: 0, target: 2, weight: 4 },
    { source: 1, target: 2, weight: 1 },
    { source: 1, target: 3, weight: 7 },
    { source: 2, target: 3, weight: 3 },
    { source: 3, target: 4, weight: 1 },
    { source: 2, target: 4, weight: 5 },
  ],
};

const GraphCreator: React.FC = () => {
  const graphBasicsTableHeader = ["Name", "Directed", "Weighted"];
  const graphBasicsTableRow = [["MyGraph", "No", "Yes"]];

  const graphDataTableHeader = ["Source", "Destination", "Weight"];

  const getLabelById = (id: number, nodes: { id: number; label: string }[]) => {
    const node = nodes.find((node) => node.id === id);
    return node ? node.label : `Unknown (${id})`;
  };

  const initialRows = graphData.edges.map((edge) => [
    getLabelById(edge.source, graphData.nodes),
    getLabelById(edge.target, graphData.nodes),
    edge.weight.toString(),
  ]);

  const [rows, setRows] = useState<string[][]>(initialRows);

  const handleRowsUpdate = (updatedRows: string[][]) => {
    setRows(updatedRows);
  };

  const getUpdatedEdges = () => {
    return rows.map(row => {
      const source = graphData.nodes.find(node => node.label === row[0])?.id || 0;
      const target = graphData.nodes.find(node => node.label === row[1])?.id || 0;
      const weight = parseInt(row[2], 10);
      return { source, target, weight };
    });
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <GraphTable
        headers={graphBasicsTableHeader}
        rows={graphBasicsTableRow}
        onRowsUpdate={() => { }}
      />
      <button className="btn btn-primary" type="button">
        Choose Algorithm
      </button>
      <div
        className="d-flex flex-column justify-content-center align-items-center mx-3 my-5 py-4 px-4"
        style={{
          borderStyle: "solid",
          borderColor: "var(--bs-body-bg)",
          borderRadius: "1em",
          width: "40%",
        }}
      >
        <GraphVisualizer nodes={graphData.nodes} edges={getUpdatedEdges()} />
      </div>
      <GraphTable
        headers={graphDataTableHeader}
        rows={rows}
        onRowsUpdate={handleRowsUpdate}
      />
      <a
        className="btn btn-primary ms-md-2 my-5 mx-5"
        role="button"
        href="#"
        style={{
          background: "var(--bs-orange)",
          borderStyle: "none",
        }}
      >
        New Row
      </a>
    </div>
  );
};

export default GraphCreator;
