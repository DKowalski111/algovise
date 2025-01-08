import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GraphVisualizer from '../graph-creator/components/GraphVisualiser';

const FloydWarshall: React.FC = () => {
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

    const adjacencyList = new Map();
    const distance: { [key: string]: { [key: string]: number } } = {};
    const nextNode: { [key: string]: { [key: string]: any } } = {}; // For path reconstruction

    // Initialize the adjacency list, distance matrix, and next node matrix
    nodes.forEach((node: { id: string }) => {
      distance[node.id] = {};
      nextNode[node.id] = {};
      nodes.forEach((target: { id: string }) => {
        if (node.id === target.id) {
          distance[node.id][target.id] = 0;
          nextNode[node.id][target.id] = null;
        } else {
          distance[node.id][target.id] = Infinity;
          nextNode[node.id][target.id] = null;
        }
      });
    });

    edges.forEach((edge: { source: { id: any; }; target: { id: any; }; weight: any; }) => {
      const sourceId = edge.source.id;
      const targetId = edge.target.id;
      const weight = edge.weight;

      // Set initial distances
      distance[sourceId][targetId] = weight;
      nextNode[sourceId][targetId] = targetId;

      if (!directed) {
        distance[targetId][sourceId] = weight;
        nextNode[targetId][sourceId] = sourceId;
      }
    });

    console.log("Initial Distance Matrix:", distance);

    // Floyd-Warshall algorithm
    nodes.forEach((k: { id: string }) => {
      nodes.forEach((i: { id: string }) => {
        nodes.forEach((j: { id: string }) => {
          if (distance[i.id][j.id] > distance[i.id][k.id] + distance[k.id][j.id]) {
            distance[i.id][j.id] = distance[i.id][k.id] + distance[k.id][j.id];
            nextNode[i.id][j.id] = nextNode[i.id][k.id];
          }
        });
      });
    });

    console.log("Final Distance Matrix:", distance);
    console.log("Next Node Matrix:", nextNode);

    // Reconstruct the path from source to destination
    const reconstructPath = (startId: string, endId: string) => {
      const path = [];
      let current = startId;
      while (current !== endId) {
        if (current === null) {
          return null; // No path
        }
        path.push(current);
        current = nextNode[current][endId];
      }
      path.push(endId);
      return path;
    };

    const path = reconstructPath(sourceId, destinationId);

    if (path) {
      const pathLabels = path.map((nodeId) =>
        nodes.find((node: { id: any; }) => node.id === nodeId)?.label
      );
      alert(`Shortest path: ${pathLabels.join(" -> ")} with total weight ${distance[sourceId][destinationId]}`);
    } else {
      alert("No path exists.");
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
        Floyd-Warshall Algorithm - Find Shortest Path
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
          1. Initialize a distance matrix with the direct distances between all pairs of nodes.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          - Set the distance to the node itself as 0 (i.e., `distance[i][i] = 0`).
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          - Set the distance between nodes that are not directly connected as infinity (i.e., `distance[i][j] = ∞`).
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          2. For each node k, iterate through all pairs of nodes (i, j) and check if the path from node i to node j through node k is shorter than the direct distance from i to j.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          3. If the path through node k is shorter, update the distance matrix as follows:
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          - `distance[i][j] = min(distance[i][j], distance[i][k] + distance[k][j])`
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          4. Repeat step 2 for every possible intermediate node k (from 1 to n).
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          5. After iterating through all nodes as intermediates, the distance matrix will contain the shortest distances between all pairs of nodes.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          6. If the distance between any node i and node j is infinity, it means there is no path between those two nodes.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          7. Return the distance matrix, which now contains the shortest distances between all pairs of nodes.
        </p>
      </div>
    </div>
  );
};

export default FloydWarshall;
