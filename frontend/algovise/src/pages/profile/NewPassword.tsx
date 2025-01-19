import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUserId } from "../../utils/AuthUtils";

const NewPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    const token = getToken();
    event.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/user/update-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: getUserId(), password: newPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password.");
      }

      setSuccess("Password updated successfully!");
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
            Change Password
          </h1>
        </header>
        <div style={{ color: "var(--bs-body-bg)", textAlign: "center" }} className="d-flex flex-column">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <p style={{ color: "var(--bs-body-bg)" }}>New Password</p>
            <input
              className="my-2 mt-0 mb-4"
              type="password"
              style={{ width: "100%" }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <p style={{ color: "var(--bs-body-bg)" }}>Confirm New Password</p>
            <input
              className="my-2 mt-0 mb-4"
              type="password"
              style={{ width: "100%" }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
              <button type="submit" className="btn btn-primary" style={{ width: "48%" }}>
                Update Password
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

export default NewPassword;