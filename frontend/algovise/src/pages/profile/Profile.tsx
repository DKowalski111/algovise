import React, { useState, useEffect } from "react";
import { getUserEmail, getUserName } from "../../utils/AuthUtils";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  name: string;
  email: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const name = getUserName();
        const email = getUserEmail();

        if (!name || !email) {
          throw new Error("Failed to fetch profile data");
        }

        setProfile({ name, email });
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="d-flex d-xxl-flex flex-row flex-grow-1 flex-shrink-1 flex-fill justify-content-center align-items-center flex-wrap justify-content-xxl-center align-items-xxl-center">
      <div
        className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-start flex-wrap justify-content-xxl-center align-items-xxl-center mx-3 my-5 py-4 px-4"
        style={{
          borderStyle: "solid",
          borderColor: "var(--bs-body-bg)",
          borderRadius: "1em",
          width: "40%",
        }}
      >
        {/* Name Section */}
        <div
          className="d-flex flex-column flex-grow-0 flex-shrink-1 justify-content-start align-items-start align-content-start flex-wrap mx-0 mx-md-5 my-4"
          style={{ width: "100%" }}
        >
          <p
            className="fs-5 text-start flex-wrap my-0 mx-5"
            style={{ color: "var(--bs-body-bg)" }}
          >
            Account Name: {profile?.name}
          </p>
          <button
            className="btn btn-primary mx-5 my-4"
            type="button"
            onClick={() => navigate("/profile/update-name")}
          >
            Change Name
          </button>
        </div>

        {/* Email Section */}
        <div
          className="d-flex flex-column flex-grow-0 flex-shrink-1 justify-content-start align-items-start align-content-start flex-wrap mx-0 mx-md-5 my-4"
          style={{ width: "100%" }}
        >
          <p
            className="fs-5 text-start flex-wrap my-0 mx-5"
            style={{ color: "var(--bs-body-bg)" }}
          >
            Account Email: {profile?.email}
          </p>
          <button
            className="btn btn-primary mx-5 my-4"
            type="button"
            onClick={() => navigate("/profile/update-email")}
          >
            Change Email
          </button>
        </div>

        {/* Password Section */}
        <div
          className="d-flex flex-column flex-grow-0 flex-shrink-1 justify-content-start align-items-start align-content-start flex-wrap mx-0 mx-md-5 my-4"
          style={{ width: "100%" }}
        >
          <p
            className="fs-5 text-start flex-wrap my-0 mx-5"
            style={{ color: "var(--bs-body-bg)" }}
          >
            Account Password: *********
          </p>
          <button
            className="btn btn-primary mx-5 my-4"
            type="button"
            onClick={() => navigate("/profile/update-password")}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
