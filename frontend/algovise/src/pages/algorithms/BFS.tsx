import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GraphVisualizer from '../graph-creator/components/GraphVisualiser';


const BFS: React.FC = () => {
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
    if (!source || !destination) {
      alert("Please provide both source and destination.");
      return;
    }

    const sourceNode = nodes.find((node: { label: string; }) => node.label === source);
    const destinationNode = nodes.find((node: { label: string; }) => node.label === destination);

    if (!sourceNode || !destinationNode) {
      alert("Invalid source or destination.");
      return;
    }

    const sourceId = sourceNode.id;
    const destinationId = destinationNode.id;

    const adjacencyList: Map<number, { id: number; weight: number }[]> = new Map();
    edges.forEach((edge: { source: number; target: number; weight: any; }) => {
      if (!adjacencyList.has(edge.source)) {
        adjacencyList.set(edge.source, []);
      }
      adjacencyList.get(edge.source)!.push({ id: edge.target, weight: edge.weight });

      if (!directed) {
        if (!adjacencyList.has(edge.target)) {
          adjacencyList.set(edge.target, []);
        }
        adjacencyList.get(edge.target)!.push({ id: edge.source, weight: edge.weight });
      }
    });

    // BFS Implementation
    const queue: { id: number; path: number[] }[] = [{ id: sourceId, path: [sourceId] }];
    const visited = new Set<number>();

    while (queue.length > 0) {
      const { id, path } = queue.shift()!;
      if (id === destinationId) {
        const pathLabels = path.map((nodeId) => nodes.find((node: { id: number; }) => node.id === nodeId)?.label);
        alert(`Path found: ${pathLabels.join(" -> ")}`);
        return;
      }

      if (!visited.has(id)) {
        visited.add(id);

        const neighbors = adjacencyList.get(id) || [];
        neighbors.forEach((neighbor) => {
          if (!visited.has(neighbor.id)) {
            queue.push({ id: neighbor.id, path: [...path, neighbor.id] });
          }
        });
      }
    }

    alert("No path exists.");
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
        Breadth-first search - find shortest path
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
          1. Initialize a queue and enqueue the start node.
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
          5. Process the dequeued node (e.g., check if it’s the target node or perform other actions).
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          6. For each unvisited neighbor of the dequeued node:
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          - Mark the neighbor as visited.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          - Enqueue the neighbor.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          7. Repeat steps 3–6 until the queue is empty or the target node is found.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          8. If the queue becomes empty and the target node has not been found, return "No path exists."
        </p>
      </div>
    </div>
  );
};

export default BFS;
