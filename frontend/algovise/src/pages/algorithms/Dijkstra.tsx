import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GraphVisualizer from '../graph-creator/components/GraphVisualiser';

const Dijsktra: React.FC = () => {
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
    const priorityQueue = [];

    nodes.forEach((node: { id: any; }) => {
      distances.set(node.id, Infinity);
      predecessors.set(node.id, null);
    });

    distances.set(sourceId, 0);
    priorityQueue.push({ id: sourceId, distance: 0 });

    console.log("Initial Distances:", Array.from(distances.entries()));

    while (priorityQueue.length > 0) {
      // Sort the queue based on distance (smallest first)
      priorityQueue.sort((a, b) => a.distance - b.distance);

      const current = priorityQueue.shift(); // Extract the first element
      if (!current) {
        console.error("Priority queue is empty unexpectedly.");
        break;
      }
      const { id: currentId } = current;

      console.log("Processing Node:", currentId);

      const neighbors = edges.filter((edge: { source: { id: any; }; }) => edge.source.id === currentId);
      neighbors.forEach((edge: { target: { id: any; }; weight: any; }) => {
        const targetId = edge.target.id;
        const weight = edge.weight;

        if (distances.get(currentId) + weight < distances.get(targetId)) {
          distances.set(targetId, distances.get(currentId) + weight);
          predecessors.set(targetId, currentId);

          priorityQueue.push({ id: targetId, distance: distances.get(targetId) });
        }

        // For undirected graphs, also process the reverse edge
        if (!directed) {
          const reverseEdge = edges.find(
            (e: { source: { id: any; }; target: { id: any; }; }) => e.source.id === targetId && e.target.id === currentId
          );

          if (reverseEdge) {
            const reverseWeight = reverseEdge.weight;
            if (distances.get(targetId) + reverseWeight < distances.get(currentId)) {
              distances.set(currentId, distances.get(targetId) + reverseWeight);
              predecessors.set(currentId, targetId);

              priorityQueue.push({ id: currentId, distance: distances.get(currentId) });
            }
          }
        }
      });

      console.log("Updated Distances:", Array.from(distances.entries()));
      console.log("Queue:", priorityQueue);
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
        <GraphVisualizer nodes={nodes} edges={edges} weighted={weighted} directed={directed} />
      </div>
      <h1 className="text-center" style={{ color: 'var(--bs-light)' }}>
        Dijkstra Algorithm - Find Shortest Path
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
          1. Initialize a distance table with the source node having a distance of 0 and all other nodes having a distance of infinity.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          2. Mark all nodes as unvisited.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          3. Set the source node as the current node.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          4. While there are unvisited nodes:
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          5. For the current node, consider all its unvisited neighbors and calculate their tentative distances through the current node.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          - For each neighbor, if the tentative distance through the current node is shorter than the previously recorded distance, update the distance table.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          6. After evaluating all neighbors, mark the current node as visited. A visited node will not be checked again.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          7. Select the unvisited node with the smallest tentative distance and set it as the new current node.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          8. Repeat steps 4–7 until the destination node is visited or the smallest tentative distance among the unvisited nodes is infinity (which means there is no path).
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          9. If the destination node is visited, return the shortest path from the source to the destination and the total distance.
        </p>
        <p className="text-center" style={{ color: 'var(--bs-light)' }}>
          10. If no path exists, return "No path exists."
        </p>
      </div>
    </div>
  );
};

export default Dijsktra;
