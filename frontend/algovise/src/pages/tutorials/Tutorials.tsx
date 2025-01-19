import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../../utils/AuthUtils";

interface Tutorial {
  id: number;
  title: string;
}

const Tutorials: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isUserAdmin, setIsUserAdmin] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutorials = async () => {
      const token = getToken();

      try {
        const response = await fetch("http://localhost:8080/tutorials/list", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data: Tutorial[] = await response.json();
          setTutorials(data);
        } else {
          console.error("Failed to fetch tutorials.");
        }
      } catch (error) {
        console.error("Error fetching tutorials:", error);
      }
    };

    const fetchAdminStatus = async () => {
      const token = getToken();
      try {
        const response = await fetch("http://localhost:8080/admin", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "text/plain",
          },
          body: token,
        });

        if (response.ok) {
          setIsUserAdmin(await response.json());
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    fetchTutorials();
    fetchAdminStatus();
  }, []);

  return (
    <div className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 flex-fill justify-content-center align-items-center flex-wrap justify-content-xxl-center align-items-xxl-center">
      {tutorials.map((tutorial, index) => (
        <Link
          key={tutorial.id}
          to={`/tutorials/${tutorial.id}`}
          className="d-flex d-xxl-flex flex-row flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center mx-3 py-4 px-4 my-3"
          style={{
            borderStyle: "solid",
            borderColor: "var(--bs-body-bg)", // Static color since no completion status
            borderRadius: "1em",
            width: "80%",
            textDecoration: "none",
          }}
        >
          <h1
            className="my-0"
            style={{ color: "var(--bs-body-bg)", textAlign: "center" }}
          >
            {index + 1}. {tutorial.title}
          </h1>
        </Link>
      ))}
      {isUserAdmin && (
        <button
          className="btn btn-primary mx-4 my-3"
          type="button"
          onClick={() => navigate("/tutorial-creator")}
        >
          Add new Tutorial
        </button>
      )}
    </div>
  );
};

export default Tutorials;
