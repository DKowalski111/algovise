import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GraphVisualizer from '../graph-creator/components/GraphVisualiser';

type Edge = {
  sourceId: any;
  targetId: any;
  weight: number;
};

const Kruskal: React.FC = () => {
  const [edgesList, setEdgesList] = useState<Edge[]>([]);
  const [parent, setParent] = useState<Map<any, any>>(new Map());
  const [rank, setRank] = useState<Map<any, number>>(new Map());
  const [mstEdges, setMstEdges] = useState<Edge[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentEdgeIndex, setCurrentEdgeIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const steps = [
    "",
    "Step 1: Initialize Kruskal.\n" +
    "• Build a list of all edges.\n" +
    "• Sort them by weight.\n" +
    "• Initialize Union-Find (parent, rank) for each node.\n",

    "Step 2: Pick the smallest edge (by weight).\n" +
    "• If the edge’s endpoints are in different sets, union them and add edge to MST.\n" +
    "• Otherwise, skip (it would form a cycle).\n",

    "Step 3: Repeat picking edges.\n" +
    "• Keep uniting sets and adding edges until you have V-1 edges or run out.\n",

    "Step 4: MST complete or no more edges.\n" +
    "• If MST has V-1 edges, you have a spanning tree.\n" +
    "• Otherwise, the graph is not fully connected.\n"
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

  function buildEdgeList() {
    const list: Edge[] = [];
    edges.forEach((edgeObj: any) => {
      const { id: src } = edgeObj.source;
      const { id: tgt } = edgeObj.target;
      const w = edgeObj.weight ?? 1;

      list.push({ sourceId: src, targetId: tgt, weight: w });
    });

    list.sort((a, b) => a.weight - b.weight);
    return list;
  }

  function makeSet(nodesArray: any[]) {
    const pMap = new Map<any, any>();
    const rMap = new Map<any, number>();

    for (let n of nodesArray) {
      pMap.set(n.id, n.id);
      rMap.set(n.id, 0);
    }
    return { pMap, rMap };
  }

  function findSet(pMap: Map<any, any>, x: any): any {
    if (pMap.get(x) !== x) {
      pMap.set(x, findSet(pMap, pMap.get(x)));
    }
    return pMap.get(x);
  }

  function unionSets(
    pMap: Map<any, any>,
    rMap: Map<any, number>,
    a: any,
    b: any
  ) {
    const rootA = findSet(pMap, a);
    const rootB = findSet(pMap, b);

    if (rootA !== rootB) {
      const rankA = rMap.get(rootA) ?? 0;
      const rankB = rMap.get(rootB) ?? 0;

      if (rankA < rankB) {
        pMap.set(rootA, rootB);
      } else if (rankA > rankB) {
        pMap.set(rootB, rootA);
      } else {
        pMap.set(rootB, rootA);
        rMap.set(rootA, rankA + 1);
      }
    }
  }

  const handleAlgorithmClick = () => {
    if (directed) {
      showPopup("Kruskal's algorithm requires an undirected graph. You have a directed graph selected.");
      return;
    }

    const edgeArray = buildEdgeList();
    const { pMap, rMap } = makeSet(nodes);

    const mst: Edge[] = [];
    for (let edge of edgeArray) {
      const { sourceId, targetId, weight } = edge;

      const rootS = findSet(pMap, sourceId);
      const rootT = findSet(pMap, targetId);

      if (rootS !== rootT) {
        unionSets(pMap, rMap, rootS, rootT);
        mst.push(edge);
      }

      if (mst.length === nodes.length - 1) break;
    }

    if (mst.length === nodes.length - 1) {
      showPopup(`MST found with ${mst.length} edges.`);
    } else {
      showPopup(
        `MST has ${mst.length} edges. The graph might be disconnected or we didn't reach V-1 edges.`
      );
    }
  };

  const initializeAlgorithm = () => {
    if (directed) {
      showPopup("Kruskal's algorithm typically requires an undirected graph.");
      return;
    }

    const eList = buildEdgeList();
    const { pMap, rMap } = makeSet(nodes);

    setEdgesList(eList);
    setParent(pMap);
    setRank(rMap);
    setMstEdges([]);
    setInitialized(true);
    setFinished(false);
    setCurrentEdgeIndex(0);
    setCurrentStepIndex(1);
  };

  const nextStep = () => {
    if (!initialized) {
      initializeAlgorithm();
      return;
    }
    if (finished) {
      showPopup("Algorithm finished. Reset to run again.");
      return;
    }

    if (currentEdgeIndex >= edgesList.length) {
      setFinished(true);
      setCurrentStepIndex(4);
      showPopup(`No more edges to process. MST size = ${mstEdges.length}`);
      return;
    }

    const edge = edgesList[currentEdgeIndex];
    setCurrentStepIndex(2);

    const newParent = new Map(parent);
    const newRank = new Map(rank);
    const newMst = [...mstEdges];

    const rootA = findSet(newParent, edge.sourceId);
    const rootB = findSet(newParent, edge.targetId);

    if (rootA !== rootB) {
      unionSets(newParent, newRank, rootA, rootB);
      newMst.push(edge);
      setCurrentStepIndex(3);
    }

    setParent(newParent);
    setRank(newRank);
    setMstEdges(newMst);
    setCurrentEdgeIndex(currentEdgeIndex + 1);

    if (newMst.length === nodes.length - 1) {
      setFinished(true);
      setCurrentStepIndex(4);
      showPopup(`MST complete with ${newMst.length} edges.`);
    }
  };

  const resetAlgorithm = () => {
    setEdgesList([]);
    setParent(new Map());
    setRank(new Map());
    setMstEdges([]);
    setInitialized(false);
    setFinished(false);
    setCurrentEdgeIndex(0);
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
        Kruskal's Algorithm - Minimum Spanning Tree
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

      <div style={{ color: 'var(--bs-light)', marginTop: '1rem' }}>
        <h5>MST Edges Chosen So Far:</h5>
        <ul>
          {mstEdges.map((e, i) => (
            <li key={i}>
              {e.sourceId} -- {e.targetId} (weight: {e.weight})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Kruskal;
