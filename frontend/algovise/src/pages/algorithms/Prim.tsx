import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GraphVisualizer from '../graph-creator/components/GraphVisualiser';

type Neighbor = {
  id: any;
  weight: number;
};

type Edge = {
  from: any;
  to: any;
  weight: number;
};

const Prim: React.FC = () => {
  const [source, setSource] = useState('');
  const [adjacencyList, setAdjacencyList] = useState<Map<any, Neighbor[]>>(new Map());
  const [visited, setVisited] = useState<Set<any>>(new Set());
  const [mstEdges, setMstEdges] = useState<Edge[]>([]);
  const [edgeCandidates, setEdgeCandidates] = useState<Edge[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const steps = [
    "",
    "Step 1: Initialize Prim.\n" +
    "• Pick a start node (source).\n" +
    "• Mark it visited.\n" +
    "• Add its edges to a priority list (sorted by weight).\n",

    "Step 2: Pick the smallest edge from visited to unvisited.\n" +
    "• If it leads to an unvisited node, add edge to MST and mark that node visited.\n" +
    "• Add that node’s edges to the priority list.\n",

    "Step 3: Repeat picking the smallest valid edge.\n" +
    "• Continue until all nodes are visited or no valid edges remain.\n",

    "Step 4: MST complete (or disconnected).\n" +
    "• If all nodes visited, we have an MST with V-1 edges.\n" +
    "• If graph is disconnected, you get a minimum spanning forest.\n"
  ];

  const location = useLocation();
  const nodes = location.state?.nodes || [];
  const edges = location.state?.edges || [];
  const weighted = location.state?.weighted || false;
  const directed = location.state?.directed || false; // Prim’s is for undirected typically
  const graphName = location.state?.graphName || "Unnamed Graph";

  // --------------------
  // Input Handlers
  // --------------------
  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSource(e.target.value);
  };

  // -------------------------
  // POPUP HELPER
  // -------------------------
  function showPopup(message: string) {
    setPopupMessage(message);
    setIsPopupVisible(true);
  }

  // -------------------------
  // Build adjacency list for (undirected) graph
  // -------------------------
  function buildAdjacencyList() {
    const adjList = new Map();
    edges.forEach((edgeObj: any) => {
      const src = edgeObj.source.id;
      const tgt = edgeObj.target.id;
      const w = edgeObj.weight ?? 1;

      if (!adjList.has(src)) adjList.set(src, []);
      adjList.get(src).push({ id: tgt, weight: w });

      // If undirected, also add reversed edge
      if (!directed) {
        if (!adjList.has(tgt)) adjList.set(tgt, []);
        adjList.get(tgt).push({ id: src, weight: w });
      }
    });
    return adjList;
  }

  // ---------------------------------
  // Perform Algorithm (Full Run)
  // ---------------------------------
  const handleAlgorithmClick = () => {
    if (directed) {
      showPopup("Prim’s algorithm is for undirected graphs. You're using a directed graph.");
      return;
    }
    if (!source) {
      showPopup("Please provide a start (source) node label.");
      return;
    }

    // Validate the source
    const sourceNode = nodes.find((node: { label: string }) => node.label === source);
    if (!sourceNode) {
      showPopup("Invalid source.");
      return;
    }

    const startId = sourceNode.id;
    const adjList = buildAdjacencyList();

    // We'll maintain:
    //  - A set of visited nodes
    //  - A priority list of edges (smallest weight first)
    //  - The MST edges
    const visitedSet = new Set<any>();
    visitedSet.add(startId);
    const mst: Edge[] = [];

    // Gather initial edges from the source
    let candidates: Edge[] = [];
    (adjList.get(startId) || []).forEach((neighbor: Neighbor) => {
      candidates.push({ from: startId, to: neighbor.id, weight: neighbor.weight });
    });

    while (candidates.length > 0) {
      // sort by weight (ascending)
      candidates.sort((a, b) => a.weight - b.weight);
      // pick the smallest edge
      const edge = candidates.shift();
      if (!edge) break;

      if (!visitedSet.has(edge.to)) {
        // This edge leads to an unvisited node => it's valid
        visitedSet.add(edge.to);
        mst.push(edge);

        // Add that node's edges
        (adjList.get(edge.to) || []).forEach((neighbor: Neighbor) => {
          if (!visitedSet.has(neighbor.id)) {
            candidates.push({
              from: edge.to,
              to: neighbor.id,
              weight: neighbor.weight
            });
          }
        });
      }
      // else we skip it because it leads to a visited node
    }

    if (mst.length === nodes.length - 1) {
      showPopup(`MST complete with ${mst.length} edges.`);
    } else {
      showPopup(
        `Prim’s ended with ${mst.length} edges. Graph may be disconnected or you have fewer edges than needed.`
      );
    }
  };

  // ---------------------------------
  // Step-by-Step
  // ---------------------------------
  const initializeAlgorithm = () => {
    if (directed) {
      showPopup("Prim’s algorithm is for undirected graphs.");
      return;
    }
    if (!source) {
      showPopup("Please provide a start (source) node label.");
      return;
    }
    const sourceNode = nodes.find((n: { label: string }) => n.label === source);
    if (!sourceNode) {
      showPopup("Invalid source node label.");
      return;
    }

    const adjList = buildAdjacencyList();
    const startId = sourceNode.id;

    // visited set
    const visitedSet = new Set<any>();
    visitedSet.add(startId);

    // gather initial edges
    const initialEdges: Edge[] = [];
    (adjList.get(startId) || []).forEach((neighbor: Neighbor) => {
      initialEdges.push({ from: startId, to: neighbor.id, weight: neighbor.weight });
    });

    setAdjacencyList(adjList);
    setVisited(visitedSet);
    setEdgeCandidates(initialEdges);
    setMstEdges([]);
    setInitialized(true);
    setFinished(false);
    setCurrentStepIndex(1); // Step 1: "Initialize"
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

    // If no candidate edges left => done
    if (edgeCandidates.length === 0) {
      setFinished(true);
      setCurrentStepIndex(4); // "MST complete or disconnected"
      showPopup(`No more edges to process. MST has ${mstEdges.length} edges.`);
      return;
    }

    // Step 2: pick the smallest edge
    setCurrentStepIndex(2);

    // sort edges
    const newCandidates = [...edgeCandidates];
    newCandidates.sort((a, b) => a.weight - b.weight);
    const smallest = newCandidates.shift();
    if (!smallest) {
      setFinished(true);
      setCurrentStepIndex(4);
      showPopup(`No edge available. MST has ${mstEdges.length} edges.`);
      return;
    }

    // check if it leads to an unvisited node
    if (!visited.has(smallest.to)) {
      // valid edge => add to MST, mark visited
      const newMST = [...mstEdges, smallest];
      const newVisited = new Set(visited);
      newVisited.add(smallest.to);

      // Step 3: gather that node's edges
      setCurrentStepIndex(3);

      (adjacencyList.get(smallest.to) || []).forEach((neighbor: Neighbor) => {
        if (!newVisited.has(neighbor.id)) {
          newCandidates.push({
            from: smallest.to,
            to: neighbor.id,
            weight: neighbor.weight
          });
        }
      });

      setMstEdges(newMST);
      setVisited(newVisited);

      // check if MST is done
      if (newMST.length === nodes.length - 1) {
        setFinished(true);
        setCurrentStepIndex(4);
        showPopup(`MST complete with ${newMST.length} edges.`);
      }
    }
    // If the edge leads to a visited node, we skip it

    setEdgeCandidates(newCandidates);
  };

  // ---------------------------------
  // RESET
  // ---------------------------------
  const resetAlgorithm = () => {
    setAdjacencyList(new Map());
    setVisited(new Set());
    setMstEdges([]);
    setEdgeCandidates([]);
    setInitialized(false);
    setFinished(false);
    setCurrentStepIndex(0);
  };

  // ---------------------------------
  // RENDER
  // ---------------------------------
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

      {/* Graph Info Table */}
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
        Prim's Algorithm - Minimum Spanning Tree
      </h1>

      {/* Source Node (start of MST) */}
      <div className="d-flex flex-row justify-content-center align-items-center flex-wrap my-4">
        <div className="d-flex flex-column justify-content-center align-items-center my-3 mx-3">
          <p className="text-center" style={{ color: 'var(--bs-light)' }}>Source Node</p>
          <input
            type="text"
            style={{ background: 'var(--bs-secondary)', borderStyle: 'none', color: 'var(--bs-light)' }}
            value={source}
            onChange={handleSourceChange}
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

      {/* MST Edges So Far */}
      <div style={{ color: 'var(--bs-light)', marginTop: '1rem' }}>
        <h5>MST Edges Chosen So Far:</h5>
        <ul>
          {mstEdges.map((edge, i) => (
            <li key={i}>
              {edge.from} -- {edge.to} (weight: {edge.weight})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Prim;
