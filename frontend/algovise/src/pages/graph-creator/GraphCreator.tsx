import React, { useState, useEffect } from "react";
import GraphVisualizer, { GraphNode } from "./components/GraphVisualiser";
import GraphTable from "./components/GraphTable";
import { getToken } from "../../utils/AuthUtils";
import { useNavigate } from "react-router-dom";
import { Graph } from "../../types/graph/Graph";

const GraphCreator: React.FC = () => {
  const navigate = useNavigate();

  const graphBasicsTableHeader = ["Name", "Directed", "Weighted"];
  const [graphBasicsTableRow, setGraphBasicsTableRow] = useState<string[][]>([["", "", ""]]);

  const graphDataTableHeader = ["Source", "Destination", "Weight", "Actions"];

  const [nodes, setNodes] = useState<{ id: number; label: string }[]>([]);
  const [edges, setEdges] = useState<{ source: number; target: number; weight: number }[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [fetchedGraph, setFetchedGraph] = useState<Graph>();

  const handleDeleteRow = (rowIndex: number) => {
    const rowToDelete = rows[rowIndex];
    const updatedRows = rows.filter((_, index) => index !== rowIndex);

    const updatedEdges = edges.filter(
      (edge) =>
        !(nodes.find((node) => node.id === edge.source)?.label === rowToDelete[0] &&
          nodes.find((node) => node.id === edge.target)?.label === rowToDelete[1])
    );

    // Remove unused nodes
    const usedNodeIds = new Set(
      updatedEdges.flatMap((edge) => [edge.source, edge.target])
    );

    const updatedNodes = nodes.filter((node) => usedNodeIds.has(node.id));

    setRows(updatedRows);
    setEdges(updatedEdges);
    setNodes(updatedNodes);
  };

  const handleRowsUpdate = (updatedRows: string[][]) => {
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    const newRow = ["", "", ""];
    setRows([...rows, newRow]);
  };

  const fetchGraphData = async (graphId: number) => {
    const token = getToken();

    try {
      const response = await fetch(`http://localhost:8080/graphs/${graphId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch graph data");
      }

      const graph = await response.json();
      setFetchedGraph(graph);
      console.log(graph);

      // Update table headers with graph metadata
      setGraphBasicsTableRow([
        [
          graph.name || "Unnamed Graph",
          graph.directed ? "Yes" : "No",
          graph.weighted ? "Yes" : "No",
        ],
      ]);

      // Map graph nodes and edges to match expected structure
      const fetchedNodes = graph.nodes.map((node: any) => ({
        id: node.id,
        label: node.label,
      }));

      console.log(graph.edges);
      const fetchedEdges = graph.edges.map((edge: any) => ({
        source: edge.source_id,
        target: edge.target_id,
        weight: edge.weight,
      }));

      const fetchedRows = fetchedEdges.map((edge: { source: any; target: any; weight: { toString: () => any; }; }) => [
        fetchedNodes.find((node: { id: any; }) => node.id === edge.source)?.label || `Unknown (${edge.source})`,
        fetchedNodes.find((node: { id: any; }) => node.id === edge.target)?.label || `Unknown (${edge.target})`,
        edge.weight.toString(),
      ]);

      // Update state
      setNodes(fetchedNodes);
      setEdges(fetchedEdges);
      setRows(fetchedRows);
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

  useEffect(() => {
    fetchGraphData(2);
  }, []);

  useEffect(() => {
    const labelToNodeMap = new Map<string, GraphNode>();
    const newEdges: { source: number; target: number; weight: number }[] = [];

    // Add nodes from rows
    rows.forEach((row) => {
      const sourceLabel = row[0];
      const targetLabel = row[1];

      if (sourceLabel && !labelToNodeMap.has(sourceLabel)) {
        const newNode = { id: labelToNodeMap.size, label: sourceLabel };
        labelToNodeMap.set(sourceLabel, newNode);
      }

      if (targetLabel && !labelToNodeMap.has(targetLabel)) {
        const newNode = { id: labelToNodeMap.size, label: targetLabel };
        labelToNodeMap.set(targetLabel, newNode);
      }
    });

    // Create edges
    rows.forEach((row) => {
      const sourceLabel = row[0];
      const targetLabel = row[1];
      const weight = parseInt(row[2], 10) || 0;

      const sourceNode = labelToNodeMap.get(sourceLabel);
      const targetNode = labelToNodeMap.get(targetLabel);

      if (sourceNode && targetNode) {
        newEdges.push({
          source: sourceNode.id,
          target: targetNode.id,
          weight,
        });
      }
    });

    // Update nodes and edges
    const newNodes = Array.from(labelToNodeMap.values());
    setNodes(newNodes);
    setEdges(newEdges);
  }, [rows]);



  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <GraphTable
        headers={graphBasicsTableHeader}
        rows={graphBasicsTableRow}
        onRowsUpdate={() => { }}
        onDeleteRow={() => { }}
      />
      <button className="btn btn-primary" type="button" onClick={() => navigate('/choose-algorithm', { state: { nodes, edges, graphName: fetchedGraph?.name, directed: fetchedGraph?.directed, weighted: fetchedGraph?.weighted } })}>
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
        <GraphVisualizer nodes={nodes} edges={edges} />
      </div>
      <GraphTable
        headers={[...graphDataTableHeader]}
        rows={rows}
        onRowsUpdate={handleRowsUpdate}
        onDeleteRow={handleDeleteRow}
      />
      <button
        className="btn btn-primary ms-md-2 my-5 mx-5"
        type="button"
        onClick={handleAddRow}
        style={{
          background: "var(--bs-orange)",
          borderStyle: "none",
        }}
      >
        New Row
      </button>
    </div>
  );
};

export default GraphCreator;
