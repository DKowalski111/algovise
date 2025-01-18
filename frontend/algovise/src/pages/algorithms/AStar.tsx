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

  // Steps for A* Explanation (adjust text as desired)
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

  // ----------------------------------
  // UTILITY: Build adjacency list
  // ----------------------------------
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

  // -------------------------
  // POPUP HELPER
  // -------------------------
  function showPopup(message: string) {
    setPopupMessage(message);
    setIsPopupVisible(true);
  }

  // -------------------------
  // 1) FULL RUN OF A*
  // -------------------------
  const handleAlgorithmClick = () => {
    if (!source || !destination) {
      showPopup("Please provide both source and destination.");
      return;
    }

    // Validate source & destination
    const sourceNode = nodes.find((n: { label: string }) => n.label === source);
    const destinationNode = nodes.find((n: { label: string }) => n.label === destination);
    if (!sourceNode || !destinationNode) {
      showPopup("Invalid source or destination.");
      return;
    }

    const sourceId = sourceNode.id;
    const destinationId = destinationNode.id;

    // Build adjacency
    const adjList = buildAdjacencyList(edges, directed);

    // Initialize g-scores
    const gMap = new Map();
    for (let n of nodes) {
      gMap.set(n.id, Infinity);
    }
    gMap.set(sourceId, 0);

    // Initialize openSet
    let open = [{
      id: sourceId,
      g: 0,
      f: 0 + heuristic(sourceId, destinationId), // f = g + h
      path: [sourceId]
    }];

    const closed = new Set();

    while (open.length > 0) {
      // sort by smallest f
      open.sort((a, b) => a.f - b.f);
      // pick node with smallest f
      const current = open.shift();
      if (!current) break;

      const { id: currentId, g: currentG, f: currentF, path } = current;

      // if we are at destination => path found
      if (currentId === destinationId) {
        const pathLabels = path.map((nid) => {
          return nodes.find((node: { id: any }) => node.id === nid)?.label;
        });
        showPopup(`Path found: ${pathLabels.join(" -> ")}, distance = ${currentG}`);
        return;
      }

      // move current to closedSet
      closed.add(currentId);

      // Relax neighbors
      const neighbors = adjList.get(currentId) || [];
      for (let neighbor of neighbors) {
        if (closed.has(neighbor.id)) continue;

        // new G value
        const tentative_g = currentG + (neighbor.weight || 1);
        const old_g = gMap.get(neighbor.id);

        if (tentative_g < old_g) {
          // update g
          gMap.set(neighbor.id, tentative_g);

          // compute new f
          const new_f = tentative_g + heuristic(neighbor.id, destinationId);

          // update openSet
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

    // If openSet is empty and we didn't return, no path
    showPopup("No path exists.");
  };

  // -----------------------------------
  // 2) STEP-BY-STEP
  // -----------------------------------
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

    // g-scores
    const gMap = new Map();
    for (let n of nodes) {
      gMap.set(n.id, Infinity);
    }
    gMap.set(sourceId, 0);

    // openSet
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
    setCurrentStepIndex(1); // Step 1: Initialize
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

    // If openSet empty => no path
    if (openSet.length === 0) {
      setCurrentStepIndex(4); // "No path or ended"
      showPopup("No path exists.");
      setFinished(true);
      return;
    }

    // 1) sort openSet by f
    const newOpenSet = [...openSet];
    newOpenSet.sort((a, b) => a.f - b.f);

    // 2) pop first => node with smallest f
    const current = newOpenSet.shift();
    if (!current) {
      setCurrentStepIndex(4);
      showPopup("No path exists.");
      setFinished(true);
      return;
    }
    setCurrentStepIndex(2); // "Pick node with smallest f"

    const { id: currentId, g: currentG, path } = current;
    const destinationId = nodes.find((n: { label: string; }) => n.label === destination)?.id;

    // check if this is the destination
    if (currentId === destinationId) {
      // Path found
      setCurrentStepIndex(4); // We can say the algorithm ended
      setFinished(true);
      const pathLabels = path.map((nid) =>
        nodes.find((node: { id: any; }) => node.id === nid)?.label
      );
      showPopup(`Path found: ${pathLabels.join(" -> ")}, distance = ${currentG}`);
      return;
    }

    // 3) Move it to closedSet
    const newClosedSet = new Set(closedSet);
    newClosedSet.add(currentId);

    // 4) Relax neighbors
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

        // see if neighbor is already in openSet
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

    // update states
    setOpenSet(newOpenSet);
    setClosedSet(newClosedSet);
    setGScores(newGScores);
  };

  // -----------------------------------
  // RESET
  // -----------------------------------
  const resetAlgorithm = () => {
    setOpenSet([]);
    setClosedSet(new Set());
    setGScores(new Map());
    setAdjacencyList(new Map());
    setInitialized(false);
    setFinished(false);
    setCurrentStepIndex(0);
  };

  // -----------------------------------
  // RENDER
  // -----------------------------------
  return (
    <div
      className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 flex-fill
                 justify-content-center align-items-center align-content-center flex-wrap
                 justify-content-xxl-center align-items-xxl-center"
    >
      {/* Popup Overlay */}
      <div
        className={`popup-overlay ${isPopupVisible ? "visible" : ""}`}
        onClick={() => setIsPopupVisible(false)}
      />
      {/* Popup Modal */}
      {isPopupVisible && (
        <div className="popup">
          <p>{popupMessage}</p>
          <button className="btn btn-primary" onClick={() => setIsPopupVisible(false)}>
            OK
          </button>
        </div>
      )}

      {/* Table with Graph Info */}
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

      {/* Graph Visualizer */}
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

      {/* Source / Destination Inputs */}
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
