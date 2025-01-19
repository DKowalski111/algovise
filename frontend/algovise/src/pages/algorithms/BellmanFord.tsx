import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GraphVisualizer from '../graph-creator/components/GraphVisualiser';

const BellmanFord: React.FC = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [distances, setDistances] = useState<Map<any, number>>(new Map());
  const [predecessors, setPredecessors] = useState<Map<any, any>>(new Map());
  const [initialized, setInitialized] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [edgesList, setEdgesList] = useState<
    { sourceId: any; targetId: any; weight: number }[]
  >([]);

  const steps = [
    "",
    "Step 1: Initialize Bellman-Ford.\n" +
    "• distance[source] = 0, distance[others] = ∞.\n" +
    "• predecessors = none.\n",

    "Step 2: Relax all edges.\n" +
    "• For each edge (u -> v), if distance[u] + weight < distance[v], update distance[v].\n" +
    "• Repeat for V-1 iterations in total.\n",

    "Step 3: Check for negative cycles.\n" +
    "• Attempt one more relaxation. If any distance improves, a negative cycle exists.\n",

    "Step 4: Algorithm ended (path found or no path possible).\n" +
    "• If the algorithm ends with no negative cycle, use predecessors to reconstruct path.\n"
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
    const edgeArray: { sourceId: any; targetId: any; weight: number }[] = [];
    edges.forEach((edgeObj: any) => {
      const { id: src } = edgeObj.source;
      const { id: tgt } = edgeObj.target;
      const w = edgeObj.weight ?? 1;
      edgeArray.push({ sourceId: src, targetId: tgt, weight: w });
      if (!directed) {
        edgeArray.push({ sourceId: tgt, targetId: src, weight: w });
      }
    });
    return edgeArray;
  }

  function getPath(predecessorMap: Map<any, any>, src: any, dest: any): any[] {
    const path = [];
    let current = dest;
    while (current !== undefined && current !== src) {
      path.push(current);
      current = predecessorMap.get(current);
    }
    if (current === src) {
      path.push(src);
      path.reverse();
      return path;
    }
    return [];
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

    const distMap = new Map();
    const predMap = new Map();

    nodes.forEach((node: any) => {
      distMap.set(node.id, Infinity);
      predMap.set(node.id, undefined);
    });
    distMap.set(sourceId, 0);

    const edgeArray = buildEdgeList();

    for (let i = 0; i < nodes.length - 1; i++) {
      let updated = false;
      for (let edge of edgeArray) {
        const { sourceId: u, targetId: v, weight } = edge;
        const newDist = distMap.get(u) + weight;
        if (distMap.get(u) !== Infinity && newDist < distMap.get(v)) {
          distMap.set(v, newDist);
          predMap.set(v, u);
          updated = true;
        }
      }
      if (!updated) break;
    }

    for (let edge of edgeArray) {
      const { sourceId: u, targetId: v, weight } = edge;
      if (distMap.get(u) !== Infinity && distMap.get(u) + weight < distMap.get(v)) {
        showPopup("Negative cycle detected, no shortest path exists.");
        return;
      }
    }

    const path = getPath(predMap, sourceId, destinationId);
    if (path.length > 0) {
      const pathLabels = path.map((id) =>
        nodes.find((node: { id: any }) => node.id === id)?.label
      );
      const distanceVal = distMap.get(destinationId);
      showPopup(`Path found: ${pathLabels.join(" -> ")}, distance = ${distanceVal}`);
    } else {
      showPopup("No path exists from source to destination.");
    }
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

    const distMap = new Map();
    const predMap = new Map();
    for (let node of nodes) {
      distMap.set(node.id, Infinity);
      predMap.set(node.id, undefined);
    }
    distMap.set(sourceNode.id, 0);

    const edgeArray = buildEdgeList();

    setDistances(distMap);
    setPredecessors(predMap);
    setEdgesList(edgeArray);
    setCurrentIteration(0);
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
      showPopup("Algorithm finished. Reset to run again.");
      return;
    }

    const V = nodes.length;
    let distMap = new Map(distances);
    let predMap = new Map(predecessors);

    if (currentIteration < V - 1) {
      setCurrentStepIndex(2);
      let updated = false;
      for (let edge of edgesList) {
        const { sourceId: u, targetId: v, weight } = edge;
        const distU = distMap.get(u) ?? Infinity;
        const distV = distMap.get(v) ?? Infinity;
        if (distU !== Infinity && distU + weight < distV) {
          distMap.set(v, distU + weight);
          predMap.set(v, u);
          updated = true;
        }
      }
      setDistances(distMap);
      setPredecessors(predMap);
      setCurrentIteration(currentIteration + 1);

      if (!updated) {
        setCurrentIteration(V - 1);
      }
    }
    else if (currentIteration === V - 1) {
      setCurrentStepIndex(3);

      for (let edge of edgesList) {
        const { sourceId: u, targetId: v, weight } = edge;
        const distU = distMap.get(u) ?? Infinity;
        const distV = distMap.get(v) ?? Infinity;
        if (distU !== Infinity && distU + weight < distV) {
          showPopup("Negative cycle detected. No shortest path solution.");
          setFinished(true);
          setCurrentIteration(currentIteration + 1);
          setCurrentStepIndex(4);
          return;
        }
      }
      setFinished(true);
      setCurrentIteration(currentIteration + 1);
      setCurrentStepIndex(4);

      const destinationNode = nodes.find((n: { label: string }) => n.label === destination);
      if (destinationNode) {
        const path = getPath(predMap, nodes.find((n: { label: string }) => n.label === source)?.id, destinationNode.id);
        if (path.length > 0) {
          const pathLabels = path.map((id) =>
            nodes.find((node: { id: any }) => node.id === id)?.label
          );
          const distVal = distMap.get(destinationNode.id);
          showPopup(`Path found: ${pathLabels.join(" -> ")}, distance = ${distVal}`);
        } else {
          showPopup("No path exists from source to destination.");
        }
      }
    }
    else {
      showPopup("Algorithm is already finished.");
      setCurrentStepIndex(4);
    }
  };

  const resetAlgorithm = () => {
    setDistances(new Map());
    setPredecessors(new Map());
    setEdgesList([]);
    setInitialized(false);
    setFinished(false);
    setCurrentIteration(0);
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
        Bellman-Ford Algorithm - Find Shortest Path
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

export default BellmanFord;
