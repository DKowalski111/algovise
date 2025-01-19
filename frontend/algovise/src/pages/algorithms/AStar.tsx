import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GraphVisualizer from '../graph-creator/components/GraphVisualiser';

const AStar: React.FC = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [openSet, setOpenSet] = useState<{ id: any; f: number; g: number; path: any[] }[]>([]);
  const [closedSet, setClosedSet] = useState<Set<any>>(new Set());
  const [gScores, setGScores] = useState<Map<any, number>>(new Map());
  const [initialized, setInitialized] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [adjacencyList, setAdjacencyList] = useState(new Map());

  const heuristic = (nodeId: any, destinationId: any) => {
    return 0;
  };

  const steps = [
    "",
    "Step 1: Initialize A*.\n" +
    "• Build adjacency list from edges.\n" +
    "• Initialize g-scores to ∞, except 0 for source.\n" +
    "• Place source in the openSet with f = g(source) + heuristic.\n",

    "Step 2: Pick node with smallest f in openSet.\n" +
    "• If it's the destination, we're done.\n" +
    "• Otherwise, move it to closedSet.\n",

    "Step 3: For each neighbor of current:\n" +
    "• Compute new_g = g(current) + edge_weight.\n" +
    "• If new_g < g(neighbor), update g(neighbor) and f(neighbor). Reinsert/update neighbor in openSet.\n",

    "Step 4: Algorithm ended (path found or no path possible).\n" +
    "• If openSet is empty, no path exists.\n" +
    "• Otherwise, the algorithm ends after finding the destination.\n"
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

    const adjList = buildAdjacencyList(edges, directed);

    const gMap = new Map();
    for (let n of nodes) {
      gMap.set(n.id, Infinity);
    }
    gMap.set(sourceId, 0);

    let open = [{
      id: sourceId,
      g: 0,
      f: 0 + heuristic(sourceId, destinationId),
      path: [sourceId]
    }];

    const closed = new Set();

    while (open.length > 0) {
      open.sort((a, b) => a.f - b.f);
      const current = open.shift();
      if (!current) break;

      const { id: currentId, g: currentG, f: currentF, path } = current;

      if (currentId === destinationId) {
        const pathLabels = path.map((nid) => {
          return nodes.find((node: { id: any }) => node.id === nid)?.label;
        });
        showPopup(`Path found: ${pathLabels.join(" -> ")}, distance = ${currentG}`);
        return;
      }

      closed.add(currentId);

      const neighbors = adjList.get(currentId) || [];
      for (let neighbor of neighbors) {
        if (closed.has(neighbor.id)) continue;

        const tentative_g = currentG + (neighbor.weight || 1);
        const old_g = gMap.get(neighbor.id);

        if (tentative_g < old_g) {
          gMap.set(neighbor.id, tentative_g);

          const new_f = tentative_g + heuristic(neighbor.id, destinationId);

          const newPath = [...path, neighbor.id];
          const existing = open.find((x) => x.id === neighbor.id);
          if (existing) {
            existing.g = tentative_g;
            existing.f = new_f;
            existing.path = newPath;
          } else {
            open.push({
              id: neighbor.id,
              g: tentative_g,
              f: new_f,
              path: newPath
            });
          }
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

    const sourceId = sourceNode.id;
    const destinationId = destinationNode.id;
    const adjList = buildAdjacencyList(edges, directed);

    const gMap = new Map();
    for (let n of nodes) {
      gMap.set(n.id, Infinity);
    }
    gMap.set(sourceId, 0);

    const initialOpenSet = [
      {
        id: sourceId,
        g: 0,
        f: 0 + heuristic(sourceId, destinationId),
        path: [sourceId]
      }
    ];

    setOpenSet(initialOpenSet);
    setClosedSet(new Set());
    setGScores(gMap);
    setAdjacencyList(adjList);
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

    if (openSet.length === 0) {
      setCurrentStepIndex(4);
      showPopup("No path exists.");
      setFinished(true);
      return;
    }

    const newOpenSet = [...openSet];
    newOpenSet.sort((a, b) => a.f - b.f);

    const current = newOpenSet.shift();
    if (!current) {
      setCurrentStepIndex(4);
      showPopup("No path exists.");
      setFinished(true);
      return;
    }
    setCurrentStepIndex(2);

    const { id: currentId, g: currentG, path } = current;
    const destinationId = nodes.find((n: { label: string; }) => n.label === destination)?.id;

    if (currentId === destinationId) {
      setCurrentStepIndex(4);
      setFinished(true);
      const pathLabels = path.map((nid) =>
        nodes.find((node: { id: any; }) => node.id === nid)?.label
      );
      showPopup(`Path found: ${pathLabels.join(" -> ")}, distance = ${currentG}`);
      return;
    }

    const newClosedSet = new Set(closedSet);
    newClosedSet.add(currentId);

    setCurrentStepIndex(3);
    const neighbors = adjacencyList.get(currentId) || [];
    const newGScores = new Map(gScores);

    for (let neighbor of neighbors) {
      if (newClosedSet.has(neighbor.id)) continue;

      const old_g = newGScores.get(neighbor.id);
      const tentative_g = currentG + (neighbor.weight || 1);

      if (old_g && tentative_g < old_g) {
        newGScores.set(neighbor.id, tentative_g);
        const new_f = tentative_g + heuristic(neighbor.id, destinationId);

        const existing = newOpenSet.find((x) => x.id === neighbor.id);
        if (existing) {
          existing.g = tentative_g;
          existing.f = new_f;
          existing.path = [...path, neighbor.id];
        } else {
          newOpenSet.push({
            id: neighbor.id,
            g: tentative_g,
            f: new_f,
            path: [...path, neighbor.id]
          });
        }
      }
    }

    setOpenSet(newOpenSet);
    setClosedSet(newClosedSet);
    setGScores(newGScores);
  };

  const resetAlgorithm = () => {
    setOpenSet([]);
    setClosedSet(new Set());
    setGScores(new Map());
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
        A* Algorithm - Find Shortest Path
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

      {/* Buttons */}
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

      {/* Step Descriptions */}
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

export default AStar;
