import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUserId, setToken } from "../../utils/AuthUtils";

const NewName: React.FC = () => {
  const [newName, setNewName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    const token = getToken();
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!newName.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/user/update-name", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: getUserId(), name: newName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update name.");
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem("name", data.name);
      setSuccess("Name updated successfully!");
      navigate("/profile"); // Navigate to the profile page or any other page after successful update
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center">
      <div
        className="d-flex flex-column flex-shrink-1 justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center my-5 mx-5 py-5 px-5 flex-wrap"
        style={{
          borderStyle: "solid",
          borderColor: "var(--bs-body-bg)",
          borderRadius: "1em",
        }}
      >
        <header>
          <h1 className="my-5" style={{ color: "var(--bs-body-bg)", textAlign: "center" }}>
            Change Name
          </h1>
        </header>
        <div style={{ color: "var(--bs-body-bg)", textAlign: "center" }} className="d-flex flex-column">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <p style={{ color: "var(--bs-body-bg)" }}>New Name</p>
            <input
              className="my-2 mt-0 mb-4"
              type="text"
              style={{ width: "100%" }}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
              <button type="submit" className="btn btn-primary" style={{ width: "48%" }}>
                Update Name
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: "48%" }}
                onClick={() => navigate("/profile")} // Navigate back to profile
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewName;
