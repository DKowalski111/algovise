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
  const [edges, setEdges] = useState<{ id: number, source: any; target: any; weight: number }[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [fetchedGraph, setFetchedGraph] = useState<Graph>();

  const handleDeleteRow = (rowIndex: number) => {
    const rowToDelete = rows[rowIndex];
    const updatedRows = rows.filter((_, index) => index !== rowIndex);

    const updatedEdges = edges.filter(
      (edge) =>
        !(
          nodes.find((node) => node.id === edge.source?.id)?.label === rowToDelete[0] &&
          nodes.find((node) => node.id === edge.target?.id)?.label === rowToDelete[1]
        )
    );

    const usedNodeIds = new Set(
      updatedEdges.flatMap((edge) => [edge.source, edge.target])
    );

    const updatedNodes = nodes.filter((node) => {
      const isUsed = usedNodeIds.has(node);
      return isUsed;
    });

    setRows(updatedRows);
    setEdges(updatedEdges);
    setNodes(updatedNodes);
  };


  const saveButtonClicked = async () => {
    try {
      await saveGraph();
      const updatedNodes = await saveNodes();
      await saveEdges(updatedNodes);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const saveGraph = async () => {
    const token = getToken();
    const graphData = {
      id: fetchedGraph?.id,
      name: graphBasicsTableRow[0][0],
      directed: graphBasicsTableRow[0][1].toLowerCase() === "yes" || graphBasicsTableRow[0][1].toLowerCase() === "true",
      weighted: graphBasicsTableRow[0][2].toLowerCase() === "yes" || graphBasicsTableRow[0][2].toLowerCase() === "true",
    };


    try {
      const response = await fetch("http://localhost:8080/graphs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphData),
      });

      if (!response.ok) {
        throw new Error("Failed to save graph");
      }

      setFetchedGraph(await response.json());
      console.log("Save graph finished")
    } catch (error) { }
  };

  const saveNodes = async () => {
    if (!fetchedGraph) return;

    const token = getToken();
    const nodeData = nodes.map((node) => ({ id: node.id ?? null, label: node.label }));

    try {
      const response = await fetch(`http://localhost:8080/graphs/${fetchedGraph.id}/nodes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nodeData),
      });

      if (!response.ok) {
        throw new Error("Failed to save nodes");
      }

      const responseJson = await response.json();
      const updatedNodes = responseJson.map((node: { id: any; label: any; }) => ({ id: node.id, label: node.label }));
      return updatedNodes;
    } catch (error) { }
  };

  const saveEdges = async (updatedNodes: { id: number; label: string }[]) => {

    if (!fetchedGraph) return;

    const token = getToken();

    const edgesToBeSent = edges.map(({ id, source, target, weight }) => {
      const updatedSourceId =
        source?.id < 0
          ? updatedNodes.find((node) => node.label === edges.find((e) => e.id === id)?.source?.label)?.id
          : source?.id;

      const updatedTargetId =
        target?.id < 0
          ? updatedNodes.find((node) => node.label === edges.find((e) => e.id === id)?.target?.label)?.id
          : target?.id;

      return {
        id,
        sourceId: updatedSourceId,
        targetId: updatedTargetId,
        weight,
      };
    });

    try {
      const response = await fetch(`http://localhost:8080/graphs/${fetchedGraph.id}/edges`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(edgesToBeSent),
      });

      if (!response.ok) {
        throw new Error("Failed to save edges");
      }

      fetchGraphData(fetchedGraph.id)
    } catch (error) { }
  };


  const handleGraphInformationUpdate = (updatedRows: string[][]) => {
    setGraphBasicsTableRow(updatedRows);
  }

  const handleRowsUpdate = (updatedRows: string[][]) => {
    setRows(updatedRows);
  };


  const handleAddRow = () => {
    const newRow = ["", "", "", ""];
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
      setGraphBasicsTableRow([
        [
          graph.name || "Unnamed Graph",
          graph.directed ? "Yes" : "No",
          graph.weighted ? "Yes" : "No",
        ],
      ]);

      const fetchedNodes = graph.nodes.map((node: any) => ({
        id: node.id,
        label: node.label,
      }));


      const fetchedEdges = graph.edges.map((edge: any) => ({
        id: edge.id,
        source: edge.source_id,
        target: edge.target_id,
        weight: edge.weight,
      }));

      const fetchedRows = fetchedEdges.map((edge: { id: number, source: any; target: any; weight: { toString: () => any; }; }) => [
        fetchedNodes.find((node: { id: any; }) => node.id === edge.source)?.label || `Unknown (${edge.source})`,
        fetchedNodes.find((node: { id: any; }) => node.id === edge.target)?.label || `Unknown (${edge.target})`,
        edge.weight.toString(),
        edge.id
      ]);

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
    const labelToNodeMap = new Map<string, { id: number; label: string }>();
    const edgeSet = new Set<string>();
    const newEdges: { id: number; source: number; target: number; weight: number }[] = [];

    nodes.forEach((node) => {
      labelToNodeMap.set(node.label, node);
    });

    let nextNodeId = nodes.length > 0 ? Math.min(-1, Math.min(...nodes.map(n => n.id)) - 1) : -1;

    rows.forEach((row) => {
      const sourceLabel = row[0];
      const targetLabel = row[1];
      const weight = parseInt(row[2], 10) || 0;

      if (sourceLabel && targetLabel) {
        if (!labelToNodeMap.has(sourceLabel)) {
          labelToNodeMap.set(sourceLabel, { id: nextNodeId--, label: sourceLabel });
        }

        if (!labelToNodeMap.has(targetLabel)) {
          labelToNodeMap.set(targetLabel, { id: nextNodeId--, label: targetLabel });
        }

        const sourceNode = labelToNodeMap.get(sourceLabel);
        const targetNode = labelToNodeMap.get(targetLabel);

        if (sourceNode && targetNode) {
          const edgeKey = `${sourceNode.id}-${targetNode.id}`;
          if (!edgeSet.has(edgeKey)) {
            edgeSet.add(edgeKey);
            newEdges.push({
              id: row[3] !== "" ? parseInt(row[3]) : -1,
              source: sourceNode.id,
              target: targetNode.id,
              weight,
            });
          }
        }
      }
    });

    const usedNodeIds = new Set(newEdges.flatMap(edge => [edge.source, edge.target]));
    const filteredNodes = Array.from(labelToNodeMap.values()).filter(node => usedNodeIds.has(node.id));

    setNodes(filteredNodes);
    setEdges(newEdges);
  }, [rows]);





  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <GraphTable
        headers={graphBasicsTableHeader}
        rows={graphBasicsTableRow}
        onRowsUpdate={handleGraphInformationUpdate}
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
      <div className="d-flex flex-row justify-content-center align-items-center">
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
        <button
          className="btn btn-primary ms-md-2 my-5 mx-5"
          type="button"
          onClick={saveButtonClicked}
          style={{
            background: "var(--bs-orange)",
            borderStyle: "none",
          }}
        >
          Save Graph
        </button>
      </div>
    </div>
  );
};

export default GraphCreator;
