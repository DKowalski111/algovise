import React, { useEffect, useState } from 'react';
import { getToken } from '../../utils/AuthUtils';

const TutorialCreator: React.FC = () => {
  const [tutorialTitle, setTutorialTitle] = useState('');
  const [tutorialFile, setTutorialFile] = useState<File | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState<boolean | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setTutorialFile(file);
      setStatusMessage(`File selected: ${file.name}`);
    } else {
      setTutorialFile(null);
      setStatusMessage('No file selected.');
    }
  };

  const handleSaveTutorial = async () => {
    if (!tutorialTitle || !tutorialFile) {
      setStatusMessage('Please provide both a title and a tutorial file.');
      return;
    }

    const token = getToken();

    if (!token) {
      console.error("Token not found");
      return;
    }

    const formData = new FormData();
    formData.append("title", tutorialTitle);
    formData.append("file", tutorialFile);
    formData.append("token", token);

    try {
      const response = await fetch('http://localhost:8080/tutorials/add', {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatusMessage('Tutorial saved successfully!');
        setTutorialTitle('');
        setTutorialFile(null);
      } else {
        setStatusMessage('Failed to save tutorial.');
      }
    } catch (error) {
      console.error('Error saving tutorial:', error);
      setStatusMessage('An error occurred while saving the tutorial.');
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = getToken();

      try {
        const response = await fetch('http://localhost:8080/admin', {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'text/plain',
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
        console.error('Error fetching user role:', error);
        setIsUserAdmin(false);
      }
    };

    fetchUserRole();
  }, []);

  if (isUserAdmin === null) {
    return <p>Loading...</p>;
  }

  if (!isUserAdmin) {
    return <p>You do not have the required permissions to access this page.</p>;
  }

  return (
    <div className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 flex-fill justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center">
      <div className="d-flex flex-row justify-content-center align-items-center flex-wrap my-4">
        <div className="d-flex flex-column justify-content-center align-items-center my-3 mx-3">
          <p className="text-center" style={{ color: 'var(--bs-light)' }}>Tutorial title</p>
          <input
            type="text"
            style={{
              background: 'var(--bs-secondary)',
              borderStyle: 'none',
              color: 'var(--bs-light)',
            }}
            value={tutorialTitle}
            onChange={(e) => setTutorialTitle(e.target.value)}
          />
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center align-content-center my-3 mx-3">
          <p className="text-center" style={{ color: 'var(--bs-light)' }}>Tutorial in .md file</p>
          <input type="file" onChange={handleFileChange} accept=".md" />
        </div>
      </div>
      <div>
        <button className="btn btn-primary" type="button" onClick={handleSaveTutorial}>
          Save Tutorial
        </button>
      </div>
      {statusMessage && (
        <div
          style={{
            marginTop: '20px',
            color: statusMessage && (statusMessage.includes('successfully') || statusMessage.includes('File selected')) ? 'green' : 'red',
          }}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default TutorialCreator;
