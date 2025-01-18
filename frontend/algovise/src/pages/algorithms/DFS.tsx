import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GraphVisualizer from '../graph-creator/components/GraphVisualiser';

const DFS: React.FC = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [stack, setStack] = useState<{ id: any; path: any[] }[]>([]);
  const [visited, setVisited] = useState(new Set());
  const [currentPath, setCurrentPath] = useState<(string | number)[]>([]);
  const [adjacencyList, setAdjacencyList] = useState(new Map());
  const [targetFound, setTargetFound] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const steps = [
    "",
    "Step 1: Initialize DFS.\n" +
    "• Build the adjacency list from your edges.\n" +
    "• Create an empty ‘visited’ set.\n" +
    "• Push the source node onto the stack with an initial path containing only that node.\n",

    "Step 2: Pop the last node from the stack.\n" +
    "• This node becomes your 'current' node.\n" +
    "• If it's the destination, you're done—return the path.\n" +
    "• Otherwise, continue to the next step.\n",

    "Step 3: For each unvisited neighbor, push it onto the stack.\n" +
    "• Check the adjacency list for neighbors of the current node.\n" +
    "• For each neighbor that hasn't been visited:\n" +
    "   – Add it to the stack with the updated path.\n" +
    "• Mark the current node as visited.\n",

    "Step 4: No path found or algorithm ended.\n" +
    "• If the stack is empty but you still haven't reached the destination, no path exists.\n" +
    "• Otherwise, the algorithm ends after finding the destination or exhausting all possible paths.\n"
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
      setPopupMessage("Please provide both source and destination.");
      setIsPopupVisible(true)
      return;
    }

    const sourceNode = nodes.find((node: { label: string }) => node.label === source);
    const destinationNode = nodes.find((node: { label: string }) => node.label === destination);

    if (!sourceNode || !destinationNode) {
      setPopupMessage("Invalid source or destination.");
      setIsPopupVisible(true)
      return;
    }

    const sourceId = sourceNode.id;
    const destinationId = destinationNode.id;

    const adjacencyList = new Map();
    edges.forEach((edge: { source: { id: any }; target: { id: any }; weight: any }) => {
      const src = edge.source.id;
      const tgt = edge.target.id;

      // Add source -> target
      if (!adjacencyList.has(src)) {
        adjacencyList.set(src, []);
      }
      adjacencyList.get(src).push({ id: tgt, weight: edge.weight });

      // If undirected, add target -> source
      if (!directed) {
        if (!adjacencyList.has(tgt)) {
          adjacencyList.set(tgt, []);
        }
        adjacencyList.get(tgt).push({ id: src, weight: edge.weight });
      }
    });

    const stack = [{ id: sourceId, path: [sourceId] }];
    const visited = new Set();

    // Perform DFS in one go
    while (stack.length > 0) {
      const popped = stack.pop();
      if (!popped) break;

      const { id, path } = popped;
      if (id === destinationId) {
        const pathLabels = path.map((nodeId) =>
          nodes.find((node: { id: any }) => node.id === nodeId)?.label
        );
        setPopupMessage(`Path found: ${pathLabels.join(" -> ")}`)
        setIsPopupVisible(true);
        return;
      }

      if (!visited.has(id)) {
        visited.add(id);
        const neighbors = adjacencyList.get(id) || [];
        neighbors.forEach((neighbor: { id: any }) => {
          if (!visited.has(neighbor.id)) {
            stack.push({ id: neighbor.id, path: [...path, neighbor.id] });
          }
        });
      }
    }

    setPopupMessage("No path exists.")
    setIsPopupVisible(true);
  };

  const initializeAlgorithm = () => {
    if (!source || !destination) {
      setPopupMessage("Please provide both source and destination.");
      setIsPopupVisible(true);
      return;
    }

    const sourceNode = nodes.find((node: { label: string }) => node.label === source);
    const destinationNode = nodes.find((node: { label: string }) => node.label === destination);

    if (!sourceNode || !destinationNode) {
      setPopupMessage("Invalid source or destination.");
      setIsPopupVisible(true);
      return;
    }

    const sourceId = sourceNode.id;
    const adjList = new Map();
    edges.forEach((edge: { source: { id: any }; target: { id: any }; weight: any }) => {
      const src = edge.source.id;
      const tgt = edge.target.id;

      if (!adjList.has(src)) adjList.set(src, []);
      adjList.get(src).push({ id: tgt, weight: edge.weight });

      if (!directed) {
        if (!adjList.has(tgt)) adjList.set(tgt, []);
        adjList.get(tgt).push({ id: src, weight: edge.weight });
      }
    });

    setAdjacencyList(adjList);
    setStack([{ id: sourceId, path: [sourceId] }]);
    setVisited(new Set());
    setCurrentPath([]);
    setTargetFound(false);
    setInitialized(true);

    setCurrentStepIndex(1);
  };

  const nextStep = () => {
    if (!initialized) {
      initializeAlgorithm();
      return;
    }

    if (stack.length === 0) {
      setPopupMessage("No path exists.");
      setIsPopupVisible(true)
      setCurrentStepIndex(4);
      return;
    }

    const newStack = [...stack];
    const popped = newStack.pop();
    setStack(newStack);

    if (!popped) {
      setPopupMessage("Stack is empty.");
      setIsPopupVisible(true)
      return;
    }

    // Now we want "Pop the last node from the stack" => that's step 2
    setCurrentStepIndex(2);

    const { id, path } = popped;
    const destinationId = nodes.find((node: { label: string; }) => node.label === destination)?.id;

    if (id === destinationId) {
      setTargetFound(true);
      const pathLabels = path.map(nodeId =>
        nodes.find((node: { id: any; }) => node.id === nodeId)?.label
      );
      setPopupMessage(`Path found: ${pathLabels.join(" -> ")}`);
      setIsPopupVisible(true)
      resetAlgorithm();
      return;
    }

    if (!visited.has(id)) {
      const newVisited = new Set(visited);
      newVisited.add(id);
      setVisited(newVisited);

      // This is "For each unvisited neighbor, push it onto the stack" => step 3
      setCurrentStepIndex(3);

      const neighbors = adjacencyList.get(id) || [];
      neighbors.forEach((neighbor: { id: unknown; }) => {
        if (!newVisited.has(neighbor.id)) {
          newStack.push({ id: neighbor.id, path: [...path, neighbor.id] });
        }
      });

      setStack(newStack);
      setCurrentPath(path);
    }
  };

  const resetAlgorithm = () => {
    setStack([]);
    setVisited(new Set());
    setCurrentPath([]);
    setAdjacencyList(new Map());
    setTargetFound(false);
    setInitialized(false);
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
          <p>
            {popupMessage}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setIsPopupVisible(false)}
          >
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
        Depth-First Search Algorithm - Find Path
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
              fontWeight: index === currentStepIndex ? "bold" : "normal"
            }}
          >
            {step.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
};

export default DFS;
