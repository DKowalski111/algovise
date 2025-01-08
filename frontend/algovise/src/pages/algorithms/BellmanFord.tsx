import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GraphVisualizer from '../graph-creator/components/GraphVisualiser';

const BellmanFord: React.FC = () => {
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

    const distances = new Map();
    const predecessors = new Map();

    nodes.forEach((node: { id: any; }) => {
      distances.set(node.id, Infinity);
      predecessors.set(node.id, null);
    });

    distances.set(sourceId, 0);

    console.log("Initial Distances:", Array.from(distances.entries()));

    for (let i = 0; i < nodes.length - 1; i++) {
      let hasUpdated = false;

      edges.forEach((edge: { source: { id: any; }; target: { id: any; }; weight: any; }) => {
        const source = edge.source.id;
        const target = edge.target.id;
        const weight = edge.weight;

        if (distances.get(source) + weight < distances.get(target)) {
          distances.set(target, distances.get(source) + weight);
          predecessors.set(target, source);
          hasUpdated = true;
        }

        // For undirected graphs, also relax the reverse edge
        if (!directed) {
          if (distances.get(target) + weight < distances.get(source)) {
            distances.set(source, distances.get(target) + weight);
            predecessors.set(source, target);
            hasUpdated = true;
          }
        }
      });

      console.log(`Iteration ${i + 1} Distances:`, Array.from(distances.entries()));

      if (!hasUpdated) {
        break;
      }
    }

    // Check for negative weight cycles
    let hasNegativeCycle = false;
    edges.forEach((edge: { source: { id: any; }; target: { id: any; }; weight: any; }) => {
      const source = edge.source.id;
      const target = edge.target.id;
      const weight = edge.weight;

      if (distances.get(source) + weight < distances.get(target)) {
        hasNegativeCycle = true;
      }
    });

    if (hasNegativeCycle) {
      alert("Graph contains a negative weight cycle.");
      return;
    }

    console.log("Final Distances:", Array.from(distances.entries()));
    console.log("Predecessors:", Array.from(predecessors.entries()));

    if (distances.get(destinationId) === Infinity) {
      alert("No path exists.");
      return;
    }

    // Construct the path from source to destination
    const path = [];
    let currentNode = destinationId;

    while (currentNode !== null) {
      path.unshift(currentNode);
      currentNode = predecessors.get(currentNode);
    }

    const pathLabels = path.map((nodeId) => nodes.find((node: { id: any; }) => node.id === nodeId)?.label);
    alert(`Shortest Path: ${pathLabels.join(" -> ")}, Distance: ${distances.get(destinationId)}`);
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
        Bellman-Ford Algorithm - Find Shortest Path
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
          1. Initialize the distance to the source node as 0 and all other nodes as infinity.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          2. For each node, set the predecessor to null (indicating no path yet).
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          3. Repeat the following steps for a total of V-1 times, where V is the number of nodes:
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          4. For each edge (u, v) with weight w:
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          - If the distance to node u plus the weight of the edge is less than the current distance to node v, update the distance to node v.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          - Set the predecessor of node v to node u.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          5. After V-1 iterations, check for negative weight cycles:
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          - For each edge (u, v) with weight w, if the distance to node u plus the weight of the edge is still less than the current distance to node v, it indicates a negative weight cycle.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          6. If no negative weight cycles are found, return the shortest distance from the source to each node and their respective predecessors.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          7. If a negative weight cycle is detected, return an indication that a negative cycle exists.
        </p>
      </div>
    </div>
  );
};

export default BellmanFord;
