import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


const AlgorithmChooser: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nodes = location.state?.nodes || [];
  const edges = location.state?.edges || [];
  const weighted = location.state?.weighted || false;
  const directed = location.state?.directed || false;
  const graphName = location.state?.graphName || "Unnamed Graph";

  const handleNavigation = (url: string) => {
    navigate(url, { state: { nodes, edges, graphName, weighted, directed } });
  };

  return (
    <div className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 flex-fill justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center">
      {/* BFS Algorithm */}
      {!weighted && (
        <div className="d-flex justify-content-center align-items-center" style={{ width: '100%' }}>
          <div
            className="d-flex d-xxl-flex flex-row flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center mx-3 my-5 py-4 px-4"
            style={{ borderRadius: '1em', width: '40%', borderStyle: 'solid', borderColor: 'var(--bs-red)' }}
          >
            <div onClick={() => handleNavigation('/bfs-algorithm')} style={{ cursor: 'pointer' }}>
              <h1 className="my-0" style={{ color: 'var(--bs-body-bg)', textAlign: 'center' }}>BFS</h1>
            </div>
          </div>
        </div>
      )}

      {/* DFS Algorithm */}
      <div className="d-flex justify-content-center align-items-center" style={{ width: '100%' }}>
        <div
          className="d-flex d-xxl-flex flex-row flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center mx-3 my-5 py-4 px-4"
          style={{ borderRadius: '1em', width: '40%', borderStyle: 'solid', borderColor: 'var(--bs-blue)' }}
        >
          <div onClick={() => handleNavigation('/dfs-algorithm')} style={{ cursor: 'pointer' }}>
            <h1 className="my-0" style={{ color: 'var(--bs-body-bg)', textAlign: 'center' }}>DFS</h1>
          </div>
        </div>
      </div>

      {/* Bellman-Ford Algorithm */}
      {weighted && directed && (
        <div className="d-flex justify-content-center align-items-center" style={{ width: '100%' }}>
          <div
            className="d-flex d-xxl-flex flex-row flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center mx-3 my-5 py-4 px-4"
            style={{ borderRadius: '1em', width: '40%', borderStyle: 'solid', borderColor: 'var(--bs-purple)' }}
          >
            <div onClick={() => handleNavigation('/bellman-ford-algorithm')} style={{ cursor: 'pointer' }}>
              <h1 className="my-0" style={{ color: 'var(--bs-body-bg)', textAlign: 'center' }}>Bellman-Ford</h1>
            </div>
          </div>
        </div>
      )}

      {/* Dijkstra Algorithm */}
      {weighted && (
        <div className="d-flex justify-content-center align-items-center" style={{ width: '100%' }}>
          <div
            className="d-flex d-xxl-flex flex-row flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center mx-3 my-5 py-4 px-4"
            style={{ borderRadius: '1em', width: '40%', borderStyle: 'solid', borderColor: 'var(--bs-indigo)' }}
          >
            <div onClick={() => handleNavigation('/dijkstra-algorithm')} style={{ cursor: 'pointer' }}>
              <h1 className="my-0" style={{ color: 'var(--bs-body-bg)', textAlign: 'center' }}>Dijkstra</h1>
            </div>
          </div>
        </div>
      )}

      {/* A* Algorithm */}
      {weighted && (
        <div className="d-flex justify-content-center align-items-center" style={{ width: '100%' }}>
          <div
            className="d-flex d-xxl-flex flex-row flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center mx-3 my-5 py-4 px-4"
            style={{ borderRadius: '1em', width: '40%', borderStyle: 'solid', borderColor: 'var(--bs-yellow)' }}
          >
            <div onClick={() => handleNavigation('/a-star-algorithm')} style={{ cursor: 'pointer' }}>
              <h1 className="my-0" style={{ color: 'var(--bs-body-bg)', textAlign: 'center' }}>A*</h1>
            </div>
          </div>
        </div>
      )}

      {/* Floyd-Warshall Algorithm */}
      {weighted && directed && (
        <div className="d-flex justify-content-center align-items-center" style={{ width: '100%' }}>
          <div
            className="d-flex d-xxl-flex flex-row flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center mx-3 my-5 py-4 px-4"
            style={{ borderRadius: '1em', width: '40%', borderStyle: 'solid', borderColor: 'var(--bs-pink)' }}
          >
            <div onClick={() => handleNavigation('/floyd-warshall-algorithm')} style={{ cursor: 'pointer' }}>
              <h1 className="my-0" style={{ color: 'var(--bs-body-bg)', textAlign: 'center' }}>Floyd-Warshall</h1>
            </div>
          </div>
        </div>
      )}

      {/* Kruskal Algorithm */}
      {weighted && !directed && (
        <div className="d-flex justify-content-center align-items-center" style={{ width: '100%' }}>
          <div
            className="d-flex d-xxl-flex flex-row flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center mx-3 my-5 py-4 px-4"
            style={{ borderRadius: '1em', width: '40%', borderStyle: 'solid', borderColor: 'var(--bs-green)' }}
          >
            <div onClick={() => handleNavigation('/kruskal-algorithm')} style={{ cursor: 'pointer' }}>
              <h1 className="my-0" style={{ color: 'var(--bs-body-bg)', textAlign: 'center' }}>Kruskal</h1>
            </div>
          </div>
        </div>
      )}

      {/* Prim Algorithm */}
      {weighted && !directed && (
        <div className="d-flex justify-content-center align-items-center" style={{ width: '100%' }}>
          <div
            className="d-flex d-xxl-flex flex-row flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center mx-3 my-5 py-4 px-4"
            style={{ borderRadius: '1em', width: '40%', borderStyle: 'solid', borderColor: 'var(--bs-teal)' }}
          >
            <div onClick={() => handleNavigation('/prim-algorithm')} style={{ cursor: 'pointer' }}>
              <h1 className="my-0" style={{ color: 'var(--bs-body-bg)', textAlign: 'center' }}>Prim</h1>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Button */}
      <button className="btn btn-primary my-5 mx-5" type="button" style={{ paddingTop: '6px' }}>
        Cancel
      </button>
    </div>
  );
};

export default AlgorithmChooser;
