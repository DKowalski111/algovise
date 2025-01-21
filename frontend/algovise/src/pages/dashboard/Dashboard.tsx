import React from "react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const tiles = [
    {
      title: "Create Graph", path: "/create-graph", icon: <svg className="icon icon-tabler icon-tabler-brand-graphql fs-1 mx-3 my-3" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--bs-orange)" }}>
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M5.308 7.265l5.385 -3.029"></path>
        <path d="M13.308 4.235l5.384 3.03"></path>
        <path d="M20 9.5v5"></path>
        <path d="M18.693 16.736l-5.385 3.029"></path>
        <path d="M10.692 19.765l-5.384 -3.03"></path>
        <path d="M4 14.5v-5"></path>
        <path d="M12.772 4.786l6.121 10.202"></path>
        <path d="M18.5 16h-13"></path>
        <path d="M5.107 14.988l6.122 -10.201"></path>
        <path d="M12 3.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0"></path>
        <path d="M12 20.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0"></path>
        <path d="M4 8m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0"></path>
        <path d="M4 16m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0"></path>
        <path d="M20 16m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0"></path>
        <path d="M20 8m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0"></path>
      </svg>
    },
    {
      title: "Saved Graphs", path: "/saved-graphs", icon: <svg className="icon icon-tabler icon-tabler-database fs-1 mx-3 my-3" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--bs-info-border-subtle)" }}>
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 6m-8 0a8 3 0 1 0 16 0a8 3 0 1 0 -16 0"></path>
        <path d="M4 6v6a8 3 0 0 0 16 0v-6"></path>
        <path d="M4 12v6a8 3 0 0 0 16 0v-6"></path>
      </svg>
    },
    {
      title: "Quizzes", path: "/quizzes", icon: <svg className="fs-1 mx-3 my-3" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="1em" viewBox="0 0 24 24" width="1em" fill="currentColor" style={{ color: "var(--bs-yellow)" }}>
        <g>
          <path d="M0,0h24v24H0V0z" fill="none"></path>
        </g>
        <g>
          <g>
            <path d="M4,6H2v14c0,1.1,0.9,2,2,2h14v-2H4V6z"></path>
            <path d="M20,2H8C6.9,2,6,2.9,6,4v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M14.01,15 c-0.59,0-1.05-0.47-1.05-1.05c0-0.59,0.47-1.04,1.05-1.04c0.59,0,1.04,0.45,1.04,1.04C15.04,14.53,14.6,15,14.01,15z M16.51,8.83 c-0.63,0.93-1.23,1.21-1.56,1.81c-0.13,0.24-0.18,0.4-0.18,1.18h-1.52c0-0.41-0.06-1.08,0.26-1.65c0.41-0.73,1.18-1.16,1.63-1.8 c0.48-0.68,0.21-1.94-1.14-1.94c-0.88,0-1.32,0.67-1.5,1.23l-1.37-0.57C11.51,5.96,12.52,5,13.99,5c1.23,0,2.08,0.56,2.51,1.26 C16.87,6.87,17.08,7.99,16.51,8.83z"></path>
          </g>
        </g>
      </svg>
    },
    {
      title: "Tutorials", path: "/tutorials", icon: <svg className="fs-1 mx-3 my-3" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="1em" viewBox="0 0 24 24" width="1em" fill="currentColor" style={{ color: "var(--bs-danger-border-subtle)" }}>
        <g>
          <rect fill="none" height="24" width="24"></rect>
        </g>
        <g>
          <g></g>
          <g>
            <path d="M21,5c-1.11-0.35-2.33-0.5-3.5-0.5c-1.95,0-4.05,0.4-5.5,1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45,4.9,1,6v14.65 c0,0.25,0.25,0.5,0.5,0.5c0.1,0,0.15-0.05,0.25-0.05C3.1,20.45,5.05,20,6.5,20c1.95,0,4.05,0.4,5.5,1.5c1.35-0.85,3.8-1.5,5.5-1.5 c1.65,0,3.35,0.3,4.75,1.05c0.1,0.05,0.15,0.05,0.25,0.05c0.25,0,0.5-0.25,0.5-0.5V6C22.4,5.55,21.75,5.25,21,5z M21,18.5 c-1.1-0.35-2.3-0.5-3.5-0.5c-1.7,0-4.15,0.65-5.5,1.5V8c1.35-0.85,3.8-1.5,5.5-1.5c1.2,0,2.4,0.15,3.5,0.5V18.5z"></path>
            <g>
              <path d="M17.5,10.5c0.88,0,1.73,0.09,2.5,0.26V9.24C19.21,9.09,18.36,9,17.5,9c-1.7,0-3.24,0.29-4.5,0.83v1.66 C14.13,10.85,15.7,10.5,17.5,10.5z"></path>
              <path d="M13,12.49v1.66c1.13-0.64,2.7-0.99,4.5-0.99c0.88,0,1.73,0.09,2.5,0.26V11.9c-0.79-0.15-1.64-0.24-2.5-0.24 C15.8,11.66,14.26,11.96,13,12.49z"></path>
              <path d="M17.5,14.33c-1.7,0-3.24,0.29-4.5,0.83v1.66c1.13-0.64,2.7-0.99,4.5-0.99c0.88,0,1.73,0.09,2.5,0.26v-1.52 C19.21,14.41,18.36,14.33,17.5,14.33z"></path>
            </g>
          </g>
        </g>
      </svg>
    },
    {
      title: "Profile", path: "/profile", icon: <svg className="fs-1 mx-3 my-3" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="1em" viewBox="0 0 24 24" width="1em" fill="currentColor" style={{ color: "#ffa0cc" }}>
        <g>
          <rect fill="none" height="24" width="24"></rect>
        </g>
        <g>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"></path>
        </g>
      </svg>
    },
  ];

  return (
    <div className="d-flex d-xxl-flex flex-row flex-grow-1 flex-shrink-1 flex-fill justify-content-center align-items-center flex-wrap justify-content-xxl-center align-items-xxl-center">
      {tiles.map((tile, index) => (
        <Link
          key={index}
          to={tile.path}
          style={{
            textDecoration: "none",
            width: "40%",
          }}
          className="mx-3 my-5"
          onClick={() => {
            localStorage.removeItem("graphId");
          }}
        >
          <div
            className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center py-4 px-4"
            style={{
              borderStyle: "solid",
              borderColor: "var(--bs-body-bg)",
              borderRadius: "1em",
              width: "100%",
            }}
          >
            <h1
              className="my-0"
              style={{ color: "var(--bs-body-bg)", textAlign: "center" }}
            >
              {tile.title}{tile.icon}
            </h1>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Dashboard;
