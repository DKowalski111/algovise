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
  const directed = location.state?.directed || false;
  const graphName = location.state?.graphName || "Unnamed Graph";

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSource(e.target.value);
  };

  function showPopup(message: string) {
    setPopupMessage(message);
    setIsPopupVisible(true);
  }

  function buildAdjacencyList() {
    const adjList = new Map();
    edges.forEach((edgeObj: any) => {
      const src = edgeObj.source.id;
      const tgt = edgeObj.target.id;
      const w = edgeObj.weight ?? 1;

      if (!adjList.has(src)) adjList.set(src, []);
      adjList.get(src).push({ id: tgt, weight: w });

      if (!directed) {
        if (!adjList.has(tgt)) adjList.set(tgt, []);
        adjList.get(tgt).push({ id: src, weight: w });
      }
    });
    return adjList;
  }

  const handleAlgorithmClick = () => {
    if (directed) {
      showPopup("Prim’s algorithm is for undirected graphs. You're using a directed graph.");
      return;
    }
    if (!source) {
      showPopup("Please provide a start (source) node label.");
      return;
    }

    const sourceNode = nodes.find((node: { label: string }) => node.label === source);
    if (!sourceNode) {
      showPopup("Invalid source.");
      return;
    }

    const startId = sourceNode.id;
    const adjList = buildAdjacencyList();

    const visitedSet = new Set<any>();
    visitedSet.add(startId);
    const mst: Edge[] = [];

    let candidates: Edge[] = [];
    (adjList.get(startId) || []).forEach((neighbor: Neighbor) => {
      candidates.push({ from: startId, to: neighbor.id, weight: neighbor.weight });
    });

    while (candidates.length > 0) {
      candidates.sort((a, b) => a.weight - b.weight);
      const edge = candidates.shift();
      if (!edge) break;

      if (!visitedSet.has(edge.to)) {
        visitedSet.add(edge.to);
        mst.push(edge);
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
    }

    if (mst.length === nodes.length - 1) {
      showPopup(`MST complete with ${mst.length} edges.`);
    } else {
      showPopup(
        `Prim’s ended with ${mst.length} edges. Graph may be disconnected or you have fewer edges than needed.`
      );
    }
  };

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

    const visitedSet = new Set<any>();
    visitedSet.add(startId);

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

    if (edgeCandidates.length === 0) {
      setFinished(true);
      setCurrentStepIndex(4);
      showPopup(`No more edges to process. MST has ${mstEdges.length} edges.`);
      return;
    }

    setCurrentStepIndex(2);

    const newCandidates = [...edgeCandidates];
    newCandidates.sort((a, b) => a.weight - b.weight);
    const smallest = newCandidates.shift();
    if (!smallest) {
      setFinished(true);
      setCurrentStepIndex(4);
      showPopup(`No edge available. MST has ${mstEdges.length} edges.`);
      return;
    }

    if (!visited.has(smallest.to)) {
      const newMST = [...mstEdges, smallest];
      const newVisited = new Set(visited);
      newVisited.add(smallest.to);

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

      if (newMST.length === nodes.length - 1) {
        setFinished(true);
        setCurrentStepIndex(4);
        showPopup(`MST complete with ${newMST.length} edges.`);
      }
    }

    setEdgeCandidates(newCandidates);
  };

  const resetAlgorithm = () => {
    setAdjacencyList(new Map());
    setVisited(new Set());
    setMstEdges([]);
    setEdgeCandidates([]);
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
        Prim's Algorithm - Minimum Spanning Tree
      </h1>

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
