import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getToken } from "../../utils/AuthUtils";

const TutorialViewer: React.FC = () => {
  const { tutorialId } = useParams<{ tutorialId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isUserAdmin, setIsUserAdmin] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorialContent = async () => {
      const token = getToken();

      if (!token) {
        setError("Authorization token not found.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/tutorials/file/${tutorialId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const markdownContent = await response.text();
          setContent(markdownContent);
        } else {
          setError(`Failed to fetch tutorial content for tutorialId: ${tutorialId}`);
        }
      } catch (err) {
        console.error("Error fetching tutorial content:", err);
        setError("An error occurred while fetching the tutorial content.");
      }
    };

    const fetchAdminStatus = async () => {
      const token = getToken();

      try {
        const response = await fetch("http://localhost:8080/admin", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",
          },
          body: token,
        });

        if (response.ok) {
          const isAdmin = await response.json();
          setIsUserAdmin(isAdmin);
        } else {
          setIsUserAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsUserAdmin(false);
      }
    };

    if (tutorialId) {
      fetchTutorialContent();
      fetchAdminStatus();
    }
  }, [tutorialId]);

  const handleDeleteTutorial = async () => {
    const token = getToken();

    if (!token) {
      alert("Authorization token not found.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/tutorials/delete/${tutorialId}?token=${token}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Tutorial deleted successfully.");
        navigate("/tutorials");
      } else {
        alert("Failed to delete tutorial.");
      }
    } catch (error) {
      console.error("Error deleting tutorial:", error);
      alert("An error occurred while deleting the tutorial.");
    }
  };

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", color: "var(--bs-body-bg)" }}>
      {isUserAdmin && (
        <button
          className="btn btn-danger"
          style={{ marginBottom: "20px" }}
          onClick={handleDeleteTutorial}
        >
          Delete Tutorial
        </button>
      )}
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default TutorialViewer;
