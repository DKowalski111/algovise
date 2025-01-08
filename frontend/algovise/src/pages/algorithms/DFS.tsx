import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GraphVisualizer from '../graph-creator/components/GraphVisualiser';

const DFS: React.FC = () => {
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
    edges.forEach((edge: { source: { id: any; }; target: { id: any; }; weight: any; }) => {
      const sourceId = edge.source.id; // Access the id from the source object
      const targetId = edge.target.id; // Access the id from the target object

      // Add source -> target edge
      if (!adjacencyList.has(sourceId)) {
        adjacencyList.set(sourceId, []);
      }
      adjacencyList.get(sourceId).push({ id: targetId, weight: edge.weight });

      // If undirected, also add target -> source edge
      if (!directed) {
        if (!adjacencyList.has(targetId)) {
          adjacencyList.set(targetId, []);
        }
        adjacencyList.get(targetId).push({ id: sourceId, weight: edge.weight });
      }
    });

    console.log("Adjacency List:", Array.from(adjacencyList.entries()));

    const stack = [{ id: sourceId, path: [sourceId] }];
    console.log("Initial Stack:", stack);

    const visited = new Set();

    while (stack.length > 0) {
      console.log("Stack Before Pop:", stack);
      const popped = stack.pop();
      if (!popped) {
        console.log("Stack is empty or invalid.");
        break;
      }

      const { id, path } = popped;
      console.log("Popped from Stack:", { id, path });

      if (id === destinationId) {
        const pathLabels = path.map((nodeId) =>
          nodes.find((node: { id: any; }) => node.id === nodeId)?.label
        );
        alert(`Path found: ${pathLabels.join(" -> ")}`);
        return;
      }

      if (!visited.has(id)) {
        visited.add(id);
        console.log("Visited Nodes:", Array.from(visited));

        const neighbors = adjacencyList.get(id) || [];
        console.log("Neighbors of Node:", id, neighbors);

        neighbors.forEach((neighbor: { id: unknown; }) => {
          if (!visited.has(neighbor.id)) {
            stack.push({ id: neighbor.id, path: [...path, neighbor.id] });
            console.log("Pushed to Stack:", { id: neighbor.id, path: [...path, neighbor.id] });
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
        Depth-First Search Algorithm - Find Shortest Path
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

export default DFS;
