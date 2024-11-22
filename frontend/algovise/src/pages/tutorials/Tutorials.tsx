import React from 'react';
import { Link } from 'react-router-dom';

// Define the type for a tutorial
interface Tutorial {
  id: number;
  title: string;
}

// Define a list of tutorials
const tutorials: Tutorial[] = [
  { id: 1, title: 'Fundamentals of Graph Theory' },
  { id: 2, title: 'Fundamental Graph Algorithms' },
  { id: 3, title: 'Advanced Graph Algorithms' },
  { id: 4, title: 'Classic Problems' },
  { id: 5, title: 'Algorithms in Vectored Graphs' },
  { id: 6, title: 'Real Life Graph Algorithms Examples' },
];

const Tutorials: React.FC = () => {
  return (
    <div className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 flex-fill justify-content-center align-items-center flex-wrap justify-content-xxl-center align-items-xxl-center">
      {tutorials.map((tutorial) => (
        <Link
          key={tutorial.id}
          to={`/tutorials/${tutorial.id}`}
          className="d-flex d-xxl-flex flex-row flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center mx-3 py-4 px-4 my-3"
          style={{
            borderStyle: 'solid',
            borderColor: 'var(--bs-body-bg)',
            borderRadius: '1em',
            width: '80%',
            textDecoration: 'none', // Remove underline from links
          }}
        >
          <h1
            className="my-0"
            style={{ color: 'var(--bs-body-bg)', textAlign: 'center' }}
          >
            {tutorial.id}. {tutorial.title}
          </h1>
        </Link>
      ))}
    </div>
  );
};

export default Tutorials;
