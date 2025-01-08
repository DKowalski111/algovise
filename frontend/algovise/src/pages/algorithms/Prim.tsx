import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GraphVisualizer from '../graph-creator/components/GraphVisualiser';

const Prim: React.FC = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  const location = useLocation();
  const nodes = location.state?.nodes || [];
  const edges = location.state?.edges || [];
  const weighted = location.state?.weighted || false;
  const directed = location.state?.directed || false;
  const graphName = location.state?.graphName || "Unnamed Graph";

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSource(e.target.value);
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
  };

  const handleAlgorithmClick = () => {
    console.log("Source:", source);
    console.log("Destination:", destination);

    if (!source || !destination) {
      alert("Please provide both source and destination.");
      return;
    }

    const sourceNode = nodes.find((node: { label: string; }) => node.label === source);
    const destinationNode = nodes.find((node: { label: string; }) => node.label === destination);

    console.log("Source Node:", sourceNode);
    console.log("Destination Node:", destinationNode);

    if (!sourceNode || !destinationNode) {
      alert("Invalid source or destination.");
      return;
    }

    const sourceId = sourceNode.id;
    const destinationId = destinationNode.id;

    console.log("Source ID:", sourceId);
    console.log("Destination ID:", destinationId);

    const adjacencyList: { [key: string]: { id: string, weight: number }[] } = {};

    edges.forEach((edge: { source: { id: string; }; target: { id: string; }; weight: number; }) => {
      const sourceId = edge.source.id;
      const targetId = edge.target.id;
      const weight = edge.weight;

      // Add the edge to the adjacency list for both directions
      if (!adjacencyList[sourceId]) adjacencyList[sourceId] = [];
      if (!adjacencyList[targetId]) adjacencyList[targetId] = [];

      adjacencyList[sourceId].push({ id: targetId, weight });
      adjacencyList[targetId].push({ id: sourceId, weight });
    });

    console.log("Adjacency List:", adjacencyList);

    const mst: { sourceId: string, targetId: string, weight: number }[] = [];
    const visited: Set<string> = new Set();
    const minHeap: { id: string, weight: number, from: string | null }[] = []; // Priority queue (min-heap)

    // Start Prim's algorithm from the source node
    const addEdges = (nodeId: string) => {
      visited.add(nodeId);
      const neighbors = adjacencyList[nodeId] || [];

      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor.id)) {
          minHeap.push({ id: neighbor.id, weight: neighbor.weight, from: nodeId });
        }
      });

      // Re-sort the minHeap after each addition (min-heap behavior)
      minHeap.sort((a, b) => a.weight - b.weight);
    };

    // Add edges from the source node
    addEdges(sourceId);

    while (minHeap.length > 0) {
      // Extract the minimum weight edge from the heap
      const { id, weight, from } = minHeap.shift()!;

      if (!visited.has(id)) {
        // If the node has not been visited yet, it's part of the MST
        visited.add(id);
        mst.push({ sourceId: from!, targetId: id, weight });

        console.log(`Added to MST: ${from} -> ${id} (Weight: ${weight})`);

        // Add new edges from the newly added node
        addEdges(id);
      }
    }

    console.log("Minimum Spanning Tree (MST):", mst);

    // Display the result of the MST (if needed)
    if (mst.length > 0) {
      const mstLabels = mst.map((edge) => {
        const sourceLabel = nodes.find((node: { id: string }) => node.id === edge.sourceId)?.label;
        const targetLabel = nodes.find((node: { id: string }) => node.id === edge.targetId)?.label;
        return `${sourceLabel} - ${targetLabel} (Weight: ${edge.weight})`;
      });

      alert(`Minimum Spanning Tree:\n${mstLabels.join("\n")}`);
    } else {
      alert("No edges in MST.");
    }
  };



  return (
    <div className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 flex-fill justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center">
      <div className="table-responsive" style={{ background: 'var(--bs-body-color)' }}>
        <table className="table">
          <thead>
            <tr>
              <th className="text-center px-4 py-4" style={{ background: 'var(--bs-body-color)', borderRadius: '3px', borderStyle: 'solid', borderColor: 'var(--bs-table-bg)', borderBottomWidth: '3px', borderBottomStyle: 'solid', color: 'var(--bs-table-bg)' }}>
                Name
              </th>
              <th className="text-center px-4 py-4" style={{ background: 'var(--bs-body-color)', borderRadius: '3px', borderStyle: 'solid', borderColor: 'var(--bs-table-bg)', borderBottomWidth: '3px', borderBottomStyle: 'solid', color: 'var(--bs-table-bg)' }}>
                Directed
              </th>
              <th className="text-center px-4 py-4" style={{ background: 'var(--bs-body-color)', borderRadius: '3px', borderStyle: 'solid', borderColor: 'var(--bs-table-bg)', borderBottomWidth: '3px', borderBottomStyle: 'solid', color: 'var(--bs-table-bg)' }}>
                Weighted
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center px-4 py-4" style={{ background: 'var(--bs-body-color)', borderRadius: '3px', borderStyle: 'solid', borderColor: 'var(--bs-table-bg)', borderBottomWidth: '3px', borderBottomStyle: 'solid', color: 'var(--bs-table-bg)' }}>
                MyGraph
              </td>
              <td className="text-center px-4 py-4" style={{ background: 'var(--bs-body-color)', borderRadius: '3px', borderStyle: 'solid', borderColor: 'var(--bs-table-bg)', borderBottomWidth: '3px', borderBottomStyle: 'solid', color: 'var(--bs-table-bg)' }}>
                {directed ? "Yes" : "No"}
              </td>
              <td className="text-center px-4 py-4" style={{ background: 'var(--bs-body-color)', borderRadius: '3px', borderStyle: 'solid', borderColor: 'var(--bs-table-bg)', borderBottomWidth: '3px', borderBottomStyle: 'solid', color: 'var(--bs-table-bg)' }}>
                {weighted ? "Yes" : "No"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-start flex-wrap justify-content-xxl-center align-items-xxl-center mx-3 my-5 py-4 px-4" style={{ borderStyle: 'solid', borderColor: 'var(--bs-body-bg)', borderRadius: '1em', width: '40%' }} >
        <GraphVisualizer nodes={nodes} edges={edges} />
      </div>
      <h1 className="text-center" style={{ color: 'var(--bs-light)' }}>
        Prim Algorithm - Minimum Spanning Tree
      </h1>
      <div className="d-flex flex-row justify-content-center align-items-center flex-wrap my-4">
        <div className="d-flex flex-column justify-content-center align-items-center my-3 mx-3">
          <p className="text-center" style={{ color: 'var(--bs-light)' }}>Source</p>
          <input
            type="text"
            style={{ background: 'var(--bs-secondary)', borderStyle: 'none', color: 'var(--bs-light)' }}
            value={source}
            onChange={handleSourceChange}
          />
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center my-3 mx-3">
          <p className="text-center" style={{ color: 'var(--bs-light)' }}>Destination</p>
          <input
            type="text"
            style={{ background: 'var(--bs-secondary)', borderStyle: 'none', color: 'var(--bs-light)' }}
            value={destination}
            onChange={handleDestinationChange}
          />
        </div>
      </div>
      <button className="btn btn-primary" type="button" onClick={handleAlgorithmClick}>
        Perform Algorithm
      </button>
      <div className="mt-4">
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          1. Initialize a queue and add the start node.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          2. Mark the start node as visited.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          3. While the queue is not empty:
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          4. Dequeue the first node from the queue.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          5. If the dequeued node is the target:
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          - Return the path from start to target.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          6. For each unvisited neighbor of the dequeued node:
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          - Mark the neighbor as visited.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          - Add the neighbor to the queue.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          7. If the target node is not found, return "No path exists".
        </p>
      </div>

    </div>
  );
};

export default Prim;
