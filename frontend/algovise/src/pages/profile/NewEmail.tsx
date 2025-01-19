import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUserId } from "../../utils/AuthUtils";

const NewEmail: React.FC = () => {
  const [newEmail, setNewEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    const token = getToken();
    event.preventDefault();
    setError("");
    setSuccess("");

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(newEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/user/update-email", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: getUserId(), email: newEmail }),
      });

      if (!response.ok) {
        throw new Error("Failed to update email.");
      }

      const data = await response.json();
      localStorage.setItem("email", data.email);
      setSuccess("Email updated successfully!");
      navigate("/profile");
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
            Change Email
          </h1>
        </header>
        <div style={{ color: "var(--bs-body-bg)", textAlign: "center" }} className="d-flex flex-column">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <p style={{ color: "var(--bs-body-bg)" }}>New Email</p>
            <input
              className="my-2 mt-0 mb-4"
              type="email"
              style={{ width: "100%" }}
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
              <button type="submit" className="btn btn-primary" style={{ width: "48%" }}>
                Update Email
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: "48%" }}
                onClick={() => navigate("/profile")}
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

export default NewEmail;
