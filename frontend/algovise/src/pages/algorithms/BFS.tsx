import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GraphVisualizer from '../graph-creator/components/GraphVisualiser';

const BFS: React.FC = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [queue, setQueue] = useState<{ id: any; path: any[] }[]>([]);
  const [visited, setVisited] = useState<Set<any>>(new Set());
  const [adjacencyList, setAdjacencyList] = useState<Map<any, { id: any }[]>>(new Map());
  const [initialized, setInitialized] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const steps = [
    "",
    "Step 1: Initialize BFS.\n" +
    "• Build an adjacency list from the edges.\n" +
    "• Create a queue and visited set.\n" +
    "• Enqueue the source node with path = [source], mark source visited.\n",

    "Step 2: Dequeue the first node from the queue.\n" +
    "• If it's the destination, we found the shortest path.\n" +
    "• Otherwise, continue.\n",

    "Step 3: For each unvisited neighbor of current:\n" +
    "• Enqueue neighbor with updated path.\n" +
    "• Mark neighbor visited.\n",

    "Step 4: If queue becomes empty, no path exists.\n" +
    "• Otherwise, algorithm ends when destination is found.\n"
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

  function showPopup(message: string) {
    setPopupMessage(message);
    setIsPopupVisible(true);
  }

  function buildAdjacencyList() {
    const adjList = new Map();
    edges.forEach((edge: any) => {
      const { id: src } = edge.source;
      const { id: tgt } = edge.target;

      if (!adjList.has(src)) adjList.set(src, []);
      adjList.get(src).push({ id: tgt });

      if (!directed) {
        if (!adjList.has(tgt)) adjList.set(tgt, []);
        adjList.get(tgt).push({ id: src });
      }
    });
    return adjList;
  }

  const handleAlgorithmClick = () => {
    if (!source || !destination) {
      showPopup("Please provide both source and destination.");
      return;
    }

    const sourceNode = nodes.find((n: { label: string }) => n.label === source);
    const destinationNode = nodes.find((n: { label: string }) => n.label === destination);
    if (!sourceNode || !destinationNode) {
      showPopup("Invalid source or destination.");
      return;
    }

    const sourceId = sourceNode.id;
    const destinationId = destinationNode.id;

    const adjList = buildAdjacencyList();

    const visitedSet = new Set<any>();
    const queueArr = [{ id: sourceId, path: [sourceId] }];
    visitedSet.add(sourceId);

    while (queueArr.length > 0) {
      const { id: currentId, path } = queueArr.shift()!;

      if (currentId === destinationId) {
        const pathLabels = path.map((nid) =>
          nodes.find((node: { id: any }) => node.id === nid)?.label
        );
        showPopup(`Path found: ${pathLabels.join(" -> ")}`);
        return;
      }

      const neighbors = adjList.get(currentId) || [];
      for (const neighbor of neighbors) {
        if (!visitedSet.has(neighbor.id)) {
          visitedSet.add(neighbor.id);
          queueArr.push({ id: neighbor.id, path: [...path, neighbor.id] });
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

    const sourceNode = nodes.find((n: { label: string }) => n.label === source);
    const destinationNode = nodes.find((n: { label: string }) => n.label === destination);
    if (!sourceNode || !destinationNode) {
      showPopup("Invalid source or destination.");
      return;
    }

    const adjList = buildAdjacencyList();

    const sourceId = sourceNode.id;
    const visitedSet = new Set<any>();
    visitedSet.add(sourceId);

    setAdjacencyList(adjList);
    setQueue([{ id: sourceId, path: [sourceId] }]);
    setVisited(visitedSet);
    setInitialized(true);
    setFinished(false);
    setCurrentStepIndex(1);
  };

  const nextStep = () => {
    if (!initialized) {
      initializeAlgorithm();
      return;
    }

    if (finished) {
      showPopup("Algorithm already finished. Reset to run again.");
      return;
    }

    if (queue.length === 0) {
      setCurrentStepIndex(4);
      showPopup("No path exists.");
      setFinished(true);
      return;
    }

    const newQueue = [...queue];
    const front = newQueue.shift();
    if (!front) {
      setCurrentStepIndex(4);
      showPopup("No path exists.");
      setFinished(true);
      return;
    }
    setCurrentStepIndex(2);

    const { id: currentId, path } = front;
    const destinationId = nodes.find((n: { label: string }) => n.label === destination)?.id;

    if (currentId === destinationId) {
      setFinished(true);
      setCurrentStepIndex(4);
      const pathLabels = path.map((nid) =>
        nodes.find((node: { id: any }) => node.id === nid)?.label
      );
      showPopup(`Path found: ${pathLabels.join(" -> ")}`);
      return;
    }

    setCurrentStepIndex(3);

    const neighbors = adjacencyList.get(currentId) || [];
    const newVisited = new Set(visited);

    for (const neighbor of neighbors) {
      if (!newVisited.has(neighbor.id)) {
        newVisited.add(neighbor.id);
        newQueue.push({ id: neighbor.id, path: [...path, neighbor.id] });
      }
    }

    setQueue(newQueue);
    setVisited(newVisited);
  };

  const resetAlgorithm = () => {
    setQueue([]);
    setVisited(new Set());
    setAdjacencyList(new Map());
    setInitialized(false);
    setFinished(false);
    setCurrentStepIndex(0);
  };

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
        Breadth-First Search Algorithm - Find Shortest Path
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

export default BFS;
