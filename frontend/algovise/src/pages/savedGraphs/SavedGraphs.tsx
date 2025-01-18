import React, { useEffect, useState } from "react";
import { getToken } from "../../utils/AuthUtils";
import { useNavigate } from "react-router-dom";

interface GraphData {
  id: number;
  name: string;
  directed: boolean;
  weighted: boolean;
}

const SavedGraphs: React.FC = () => {
  const [graphs, setGraphs] = useState<GraphData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGraphs();
  }, []);

  const fetchGraphs = async () => {
    try {
      const token = getToken();
      const response = await fetch("http://localhost:8080/graphs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch graphs");
      }

      const data = await response.json();
      setGraphs(data);
    } catch (error) {
      console.error("Error fetching graphs:", error);
    }
  };

  const handlePick = (graphId: number) => {
    navigate("/create-graph", { state: { graphId } });
  };

  const handleDelete = async (graphId: number) => {

    try {
      const token = getToken();
      const response = await fetch(`http://localhost:8080/graphs/${graphId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete graph");
      }

      setGraphs((prev) => prev.filter((graph) => graph.id !== graphId));
    } catch (error) {
      console.error("Error deleting graph:", error);
    }
  };

  return (
    <div className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 flex-fill justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center">
      <div
        className="table-responsive"
        style={{ background: "var(--bs-body-color)" }}
      >
        <table className="table">
          <thead>
            <tr>
              <th
                className="text-center px-4 py-4"
                style={{
                  background: "var(--bs-body-color)",
                  borderRadius: "3px",
                  borderStyle: "solid",
                  borderColor: "var(--bs-table-bg)",
                  borderBottomWidth: "3px",
                  borderBottomStyle: "solid",
                  color: "var(--bs-table-bg)",
                }}
              >
                Name
              </th>
              <th
                className="text-center px-4 py-4"
                style={{
                  background: "var(--bs-body-color)",
                  borderRadius: "3px",
                  borderStyle: "solid",
                  borderColor: "var(--bs-table-bg)",
                  borderBottomWidth: "3px",
                  borderBottomStyle: "solid",
                  color: "var(--bs-table-bg)",
                }}
              >
                Directed
              </th>
              <th
                className="text-center px-4 py-4"
                style={{
                  background: "var(--bs-body-color)",
                  borderRadius: "3px",
                  borderStyle: "solid",
                  borderColor: "var(--bs-table-bg)",
                  borderBottomWidth: "3px",
                  borderBottomStyle: "solid",
                  color: "var(--bs-table-bg)",
                }}
              >
                Weighted
              </th>
              <th
                className="text-center px-4 py-4"
                style={{
                  background: "var(--bs-body-color)",
                  borderRadius: "3px",
                  borderStyle: "solid",
                  borderColor: "var(--bs-table-bg)",
                  borderBottomWidth: "3px",
                  borderBottomStyle: "solid",
                  color: "var(--bs-table-bg)",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {graphs.map((graph) => (
              <tr key={graph.id}>
                <td
                  className="text-center align-content-center px-4 py-4"
                  style={{
                    background: "var(--bs-body-color)",
                    borderRadius: "3px",
                    borderStyle: "solid",
                    borderColor: "var(--bs-table-bg)",
                    borderBottomWidth: "3px",
                    borderBottomStyle: "solid",
                    color: "var(--bs-table-bg)",
                  }}
                >
                  {graph.name}
                </td>
                <td
                  className="text-center align-content-center px-4 py-4"
                  style={{
                    background: "var(--bs-body-color)",
                    borderRadius: "3px",
                    borderStyle: "solid",
                    borderColor: "var(--bs-table-bg)",
                    borderBottomWidth: "3px",
                    borderBottomStyle: "solid",
                    color: "var(--bs-table-bg)",
                  }}
                >
                  {graph.directed ? "Yes" : "No"}
                </td>
                <td
                  className="text-center align-content-center px-4 py-4"
                  style={{
                    background: "var(--bs-body-color)",
                    borderRadius: "3px",
                    borderStyle: "solid",
                    borderColor: "var(--bs-table-bg)",
                    borderBottomWidth: "3px",
                    borderBottomStyle: "solid",
                    color: "var(--bs-table-bg)",
                  }}
                >
                  {graph.weighted ? "Yes" : "No"}
                </td>
                <td
                  className="text-center px-4 py-4"
                  style={{
                    background: "var(--bs-body-color)",
                    borderRadius: "3px",
                    borderStyle: "solid",
                    borderColor: "var(--bs-table-bg)",
                    borderBottomWidth: "3px",
                    borderBottomStyle: "solid",
                    color: "var(--bs-table-bg)",
                  }}
                >
                  <div className="flex-row">
                    <button
                      className="btn btn-primary mx-3 my-3"
                      type="button"
                      onClick={() => handlePick(graph.id)}
                    >
                      Pick
                    </button>
                    <button
                      className="btn btn-danger mx-3 my-3"
                      type="button"
                      onClick={() => handleDelete(graph.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a
        className="btn btn-primary ms-md-2 my-5"
        role="button"
        href="#"
        style={{
          background: "var(--bs-orange)",
          borderStyle: "none",
        }}
      >
        New Graph
      </a>
    </div>
  );
};

export default SavedGraphs;
