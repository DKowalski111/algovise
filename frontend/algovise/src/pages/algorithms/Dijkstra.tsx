import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GraphVisualizer from '../graph-creator/components/GraphVisualiser';

const Dijkstra: React.FC = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [priorityQueue, setPriorityQueue] = useState<{ id: any; distance: number; path: any[] }[]>([]);
  const [distances, setDistances] = useState<Map<any, number>>(new Map());
  const [finished, setFinished] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [adjacencyList, setAdjacencyList] = useState(new Map());

  const steps = [
    "",
    "Step 1: Initialize Dijkstra.\n" +
    "• Build the adjacency list from edges.\n" +
    "• Create a ‘distances’ map with ∞ for all nodes except 0 for the source.\n" +
    "• Push the source node into the priority queue with distance 0.\n",

    "Step 2: Extract the node with the smallest distance from the queue.\n" +
    "• This node is our 'current' node. If it's the destination, we're done.\n" +
    "• Otherwise, continue.\n",

    "Step 3: Relax the neighbors of the current node.\n" +
    "• For each neighbor, calculate potential new distance.\n" +
    "• If it's smaller, update the neighbor's distance & path, then push back to queue.\n",

    "Step 4: Algorithm ended (path found or no path possible).\n" +
    "• If the queue is empty before finding the destination, no path exists.\n" +
    "• Otherwise, the algorithm ends after extracting the destination node.\n"
  ];

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
      showPopup("Please provide both source and destination.");
      return;
    }

    const sourceNode = nodes.find((node: { label: string }) => node.label === source);
    const destinationNode = nodes.find((node: { label: string }) => node.label === destination);
    if (!sourceNode || !destinationNode) {
      showPopup("Invalid source or destination.");
      return;
    }

    const sourceId = sourceNode.id;
    const destinationId = destinationNode.id;

    const adjList = buildAdjacencyList(edges, directed);
    const distMap = new Map();
    for (const node of nodes) {
      distMap.set(node.id, Infinity);
    }
    distMap.set(sourceId, 0);

    let pq = [{ id: sourceId, distance: 0, path: [sourceId] }];

    while (pq.length > 0) {
      pq.sort((a, b) => a.distance - b.distance);

      const current = pq.shift();
      if (!current) break;

      const { id: currentId, distance: currentDist, path } = current;

      if (currentId === destinationId) {
        const pathLabels = path.map((nodeId) =>
          nodes.find((n: { id: any }) => n.id === nodeId)?.label
        );
        showPopup(`Shortest Path found: ${pathLabels.join(" -> ")}, distance = ${currentDist}`);
        return;
      }

      const neighbors = adjList.get(currentId) || [];
      for (const neighbor of neighbors) {
        const newDist = currentDist + (neighbor.weight || 1);
        if (newDist < distMap.get(neighbor.id)) {
          distMap.set(neighbor.id, newDist);
          const newPath = [...path, neighbor.id];
          pq.push({ id: neighbor.id, distance: newDist, path: newPath });
        }
      }
    }

    showPopup("No path exists.");
  };

  const initializeAlgorithm = () => {
    if (!source || !destination) {
      showPopup("Please provide both source and destination.");
      return;
    }

    const sourceNode = nodes.find((node: { label: string }) => node.label === source);
    const destinationNode = nodes.find((node: { label: string }) => node.label === destination);
    if (!sourceNode || !destinationNode) {
      showPopup("Invalid source or destination.");
      return;
    }

    const adjList = buildAdjacencyList(edges, directed);

    const distMap = new Map();
    for (const node of nodes) {
      distMap.set(node.id, Infinity);
    }
    distMap.set(sourceNode.id, 0);

    setPriorityQueue([{
      id: sourceNode.id,
      distance: 0,
      path: [sourceNode.id]
    }]);

    setAdjacencyList(adjList);
    setDistances(distMap);
    setFinished(false);
    setInitialized(true);
    setCurrentStepIndex(1);
  };

  const nextStep = () => {
    if (!initialized) {
      initializeAlgorithm();
      return;
    }

    if (finished || priorityQueue.length === 0) {
      setCurrentStepIndex(4);
      showPopup("No path exists or algorithm already finished.");
      return;
    }

    const newPQ = [...priorityQueue];
    newPQ.sort((a, b) => a.distance - b.distance);

    const current = newPQ.shift();
    if (!current) {
      setCurrentStepIndex(4);
      showPopup("No path exists.");
      return;
    }
    setCurrentStepIndex(2);

    const { id: currentId, distance: currentDist, path } = current;

    const destinationId = nodes.find((node: { label: string; }) => node.label === destination)?.id;
    if (currentId === destinationId) {
      setFinished(true);
      setCurrentStepIndex(4);
      const pathLabels = path.map((nodeId) =>
        nodes.find((n: { id: any; }) => n.id === nodeId)?.label
      );
      showPopup(`Shortest Path found: ${pathLabels.join(" -> ")}, distance = ${currentDist}`);
      return;
    }

    setCurrentStepIndex(3);
    const neighbors = adjacencyList.get(currentId) || [];
    const updatedDistances = new Map(distances);
    for (const neighbor of neighbors) {
      const oldDist = updatedDistances.get(neighbor.id);
      const newDist = currentDist + (neighbor.weight || 1);
      if (oldDist && newDist < oldDist) {
        updatedDistances.set(neighbor.id, newDist);
        newPQ.push({
          id: neighbor.id,
          distance: newDist,
          path: [...path, neighbor.id]
        });
      }
    }
    setDistances(updatedDistances);
    setPriorityQueue(newPQ);
  };

  const resetAlgorithm = () => {
    setPriorityQueue([]);
    setDistances(new Map());
    setFinished(false);
    setInitialized(false);
    setAdjacencyList(new Map());
    setCurrentStepIndex(0);
  };

  function buildAdjacencyList(
    edgesArr: { source: { id: any }; target: { id: any }; weight: any }[],
    isDirected: boolean
  ) {
    const adjList = new Map();
    edgesArr.forEach((edge) => {
      const { id: src } = edge.source;
      const { id: tgt } = edge.target;
      if (!adjList.has(src)) adjList.set(src, []);
      adjList.get(src).push({ id: tgt, weight: edge.weight });

      if (!isDirected) {
        if (!adjList.has(tgt)) adjList.set(tgt, []);
        adjList.get(tgt).push({ id: src, weight: edge.weight });
      }
    });
    return adjList;
  }

  function showPopup(message: string) {
    setPopupMessage(message);
    setIsPopupVisible(true);
  }

  return (
    <div
      className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 flex-fill
                 justify-content-center align-items-center align-content-center flex-wrap
                 justify-content-xxl-center align-items-xxl-center"
    >
      <div
        className={`popup-overlay ${isPopupVisible ? "visible" : ""}`}
        onClick={() => setIsPopupVisible(false)}
      />
      {isPopupVisible && (
        <div className="popup">
          <p>{popupMessage}</p>
          <button className="btn btn-primary" onClick={() => setIsPopupVisible(false)}>
            OK
          </button>
        </div>
      )}

      <div className="table-responsive" style={{ background: 'var(--bs-body-color)' }}>
        <table className="table">
          <thead>
            <tr>
              <th
                className="text-center px-4 py-4"
                style={{
                  background: 'var(--bs-body-color)',
                  borderRadius: '3px',
                  borderStyle: 'solid',
                  borderColor: 'var(--bs-table-bg)',
                  borderBottomWidth: '3px',
                  borderBottomStyle: 'solid',
                  color: 'var(--bs-table-bg)'
                }}
              >
                Name
              </th>
              <th
                className="text-center px-4 py-4"
                style={{
                  background: 'var(--bs-body-color)',
                  borderRadius: '3px',
                  borderStyle: 'solid',
                  borderColor: 'var(--bs-table-bg)',
                  borderBottomWidth: '3px',
                  borderBottomStyle: 'solid',
                  color: 'var(--bs-table-bg)'
                }}
              >
                Directed
              </th>
              <th
                className="text-center px-4 py-4"
                style={{
                  background: 'var(--bs-body-color)',
                  borderRadius: '3px',
                  borderStyle: 'solid',
                  borderColor: 'var(--bs-table-bg)',
                  borderBottomWidth: '3px',
                  borderBottomStyle: 'solid',
                  color: 'var(--bs-table-bg)'
                }}
              >
                Weighted
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                className="text-center px-4 py-4"
                style={{
                  background: 'var(--bs-body-color)',
                  borderRadius: '3px',
                  borderStyle: 'solid',
                  borderColor: 'var(--bs-table-bg)',
                  borderBottomWidth: '3px',
                  borderBottomStyle: 'solid',
                  color: 'var(--bs-table-bg)'
                }}
              >
                {graphName}
              </td>
              <td
                className="text-center px-4 py-4"
                style={{
                  background: 'var(--bs-body-color)',
                  borderRadius: '3px',
                  borderStyle: 'solid',
                  borderColor: 'var(--bs-table-bg)',
                  borderBottomWidth: '3px',
                  borderBottomStyle: 'solid',
                  color: 'var(--bs-table-bg)'
                }}
              >
                {directed ? "Yes" : "No"}
              </td>
              <td
                className="text-center px-4 py-4"
                style={{
                  background: 'var(--bs-body-color)',
                  borderRadius: '3px',
                  borderStyle: 'solid',
                  borderColor: 'var(--bs-table-bg)',
                  borderBottomWidth: '3px',
                  borderBottomStyle: 'solid',
                  color: 'var(--bs-table-bg)'
                }}
              >
                {weighted ? "Yes" : "No"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 justify-content-center
                   align-items-center align-content-start flex-wrap justify-content-xxl-center
                   align-items-xxl-center mx-3 my-5 py-4 px-4"
        style={{ borderStyle: 'solid', borderColor: 'var(--bs-body-bg)', borderRadius: '1em', width: '40%' }}
      >
        <GraphVisualizer nodes={nodes} edges={edges} weighted={weighted} directed={directed} />
      </div>

      <h1 className="text-center" style={{ color: 'var(--bs-light)' }}>
        Dijkstra's Algorithm - Find Shortest Path
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

      <div className="d-flex flex-row justify-content-center align-items-center">
        <button className="btn btn-primary mx-4 my-3" type="button" onClick={handleAlgorithmClick}>
          Perform Algorithm
        </button>
        <button className="btn btn-primary mx-4 my-3" type="button" onClick={nextStep}>
          Go Step-By-Step
        </button>
        <button className="btn btn-primary mx-4 my-3" type="button" onClick={resetAlgorithm}>
          Reset
        </button>
      </div>

      <div className="mt-4">
        {steps.map((step, index) => (
          <p
            key={index}
            className="text-center"
            style={{
              color: index === currentStepIndex ? "var(--bs-primary)" : "var(--bs-light)",
              fontWeight: index === currentStepIndex ? "bold" : "normal",
              whiteSpace: "pre-line"
            }}
          >
            {step}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Dijkstra;
