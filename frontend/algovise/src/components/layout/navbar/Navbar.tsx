import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkToken } from '../../../utils/AuthUtils';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  const checkIfTokenValid = () => {
    checkToken().then((isValid) => {
      setIsTokenValid(isValid);
    }).catch(() => {
      setIsTokenValid(false);
    });

  };

  useEffect(() => {
    checkIfTokenValid();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    setIsTokenValid(false);
    navigate('/login');
  };

  return (
    <nav
      className="bg-dark navbar navbar-expand-md py-3"
      style={{
        background: 'black',
        borderBottomStyle: 'solid',
        borderBottomColor: 'var(--bs-secondary-bg-subtle)',
      }}
    >
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <span
            className="d-flex justify-content-center align-items-center bs-icon-sm bs-icon-rounded bs-icon-primary me-2 p-2 bs-icon rounded"
            style={{
              color: 'var(--bs-orange)',
              background: 'var(--bs-orange)',
            }}
          >
            <svg
              className="bi bi-bezier"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              fill="currentColor"
              viewBox="0 0 16 16"
              style={{
                borderColor: 'var(--bs-navbar-color)',
                color: 'var(--bs-body-bg)',
                background: 'var(--bs-orange)',
              }}
            >
              <path
                fillRule="evenodd"
                d="M0 10.5A1.5 1.5 0 0 1 1.5 9h1A1.5 1.5 0 0 1 4 10.5v1A1.5 1.5 0 0 1 2.5 13h-1A1.5 1.5 0 0 1 0 11.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm10.5.5A1.5 1.5 0 0 1 13.5 9h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM6 4.5A1.5 1.5 0 0 1 7.5 3h1A1.5 1.5 0 0 1 10 4.5v1A1.5 1.5 0 0 1 8.5 7h-1A1.5 1.5 0 0 1 6 5.5zM7.5 4a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"
              ></path>
              <path d="M6 4.5H1.866a1 1 0 1 0 0 1h2.668A6.517 6.517 0 0 0 1.814 9H2.5c.123 0 .244.015.358.043a5.517 5.517 0 0 1 3.185-3.185A1.503 1.503 0 0 1 6 5.5zm3.957 1.358A1.5 1.5 0 0 0 10 5.5v-1h4.134a1 1 0 1 1 0 1h-2.668a6.517 6.517 0 0 1 2.72 3.5H13.5c-.123 0-.243.015-.358.043a5.517 5.517 0 0 0-3.185-3.185z"></path>
            </svg>
          </span>
          <span className="fs-3 fw-bold" style={{ color: 'var(--bs-body-bg)' }}>
            AlgoVise
          </span>
        </a>
        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navcol-2"
          style={{ background: 'var(--bs-orange)' }}
        >
          <span className="visually-hidden">Toggle navigation</span>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="navcol-2" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/tutorials" style={{ color: 'var(--bs-body-bg)' }}>
                Tutorials
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/quizzes" style={{ color: 'var(--bs-body-bg)' }}>
                Quizzes
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/saved-graphs" style={{ color: 'var(--bs-body-bg)' }}>
                Saved Graphs
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/profile" style={{ color: 'var(--bs-body-bg)' }}>
                Profile
              </a>
            </li>
            {isTokenValid === true && (
              <li className="nav-item">
                <button
                  className="btn btn-danger"
                  onClick={handleLogout}
                  style={{
                    background: 'var(--bs-red)',
                    borderStyle: 'none',
                    marginLeft: '10px',
                  }}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
          <a
            className="btn btn-primary ms-md-2"
            role="button"
            href="/create-graph"
            style={{
              background: 'var(--bs-orange)',
              borderStyle: 'none',
            }}
            onClick={() => {
              localStorage.removeItem("graphId");
            }}
          >
            New Graph
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
