import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GraphVisualizer from '../graph-creator/components/GraphVisualiser';

const Kruskal: React.FC = () => {
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

    const edgesList: { sourceId: string, targetId: string, weight: number }[] = [];
    edges.forEach((edge: { source: { id: string; }; target: { id: string; }; weight: number; }) => {
      const sourceId = edge.source.id;
      const targetId = edge.target.id;
      const weight = edge.weight;
      edgesList.push({ sourceId, targetId, weight });
      if (!directed) {
        edgesList.push({ sourceId: targetId, targetId: sourceId, weight });
      }
    });

    // Sort edges by weight
    edgesList.sort((a, b) => a.weight - b.weight);

    console.log("Sorted Edges:", edgesList);

    // Union-Find (Disjoint Set) data structure
    const parent: { [key: string]: string } = {};
    const rank: { [key: string]: number } = {};

    // Initialize Union-Find sets
    nodes.forEach((node: { id: string }) => {
      parent[node.id] = node.id;
      rank[node.id] = 0;
    });

    // Find with path compression
    const find = (node: string): string => {
      if (parent[node] !== node) {
        parent[node] = find(parent[node]);
      }
      return parent[node];
    };

    // Union by rank
    const union = (node1: string, node2: string): boolean => {
      const root1 = find(node1);
      const root2 = find(node2);
      if (root1 !== root2) {
        // Union by rank
        if (rank[root1] > rank[root2]) {
          parent[root2] = root1;
        } else if (rank[root1] < rank[root2]) {
          parent[root1] = root2;
        } else {
          parent[root2] = root1;
          rank[root1]++;
        }
        return true;
      }
      return false;
    };

    const mst: { sourceId: string, targetId: string, weight: number }[] = [];

    // Kruskal's Algorithm: Process edges in sorted order
    edgesList.forEach((edge) => {
      if (union(edge.sourceId, edge.targetId)) {
        mst.push(edge);
      }
    });

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
        Kruskal Algorithm - Minimum Spanning Tree
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
          1. Initialize a priority queue and add the starting node with a key value of 0.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          2. Mark all nodes as unvisited, except the starting node, which is visited.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          3. While the priority queue is not empty:
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          4. Extract the node with the smallest key value from the priority queue. This is the current node.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          5. For each unvisited neighbor of the current node:
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          - If the neighbor's key value is greater than the edge weight between the current node and the neighbor, update the neighbor’s key value and set the current node as its parent.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          - Add the neighbor to the priority queue with the updated key value.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          6. Repeat steps 4 and 5 until all nodes are visited.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          7. The result is a Minimum Spanning Tree (MST) formed by the edges connecting each node to its parent.
        </p>
      </div>
    </div>
  );
};

export default Kruskal;
