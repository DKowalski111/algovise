import React from "react";
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
  const headers1 = ["Name", "Directed", "Weighted"];
  const rows1 = [["MyGraph", "No", "Yes"]];

  const headers2 = ["Source", "Destination", "Weight"];
  const rows2 = [
    ["1", "2", "2"],
    ["2", "3", "3"],
  ];

  return (
    <div className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 flex-fill justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center">
      <GraphTable headers={headers1} rows={rows1} />
      <button className="btn btn-primary" type="button">
        Choose Algorithm
      </button>
      <div
        className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-start flex-wrap justify-content-xxl-center align-items-xxl-center mx-3 my-5 py-4 px-4"
        style={{
          borderStyle: "solid",
          borderColor: "var(--bs-body-bg)",
          borderRadius: "1em",
          width: "40%",
        }}
      >
        <GraphVisualizer nodes={graphData.nodes} edges={graphData.edges} />
      </div>
      <GraphTable headers={headers2} rows={rows2} />
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
