import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken } from "../../utils/AuthUtils";

interface Quiz {
  id: number;
  title: string;
  path: string;
}

const quizzes: Quiz[] = [
  { id: 1, title: "Fundamentals of Graph Theory", path: "/quizzes/fundamentals-of-graph-theory" },
  { id: 2, title: "Basic Graph Algorithms", path: "/quizzes/basic-graph-algorithms" },
  { id: 3, title: "Advanced Graph Algorithms", path: "/quizzes/advanced-graph-algorithms" },
  { id: 4, title: "Classic Problems in Graph Theory", path: "/quizzes/classic-problems" },
  { id: 5, title: "Algorithms for Directed Graphs", path: "/quizzes/algorithms-for-directed-graphs" },
  { id: 6, title: "Real-World Examples of Graph Algorithms", path: "/quizzes/real-world-graph-algorithms" },
];

const getUserId = (): number | null => {
  const userId = localStorage.getItem("id");
  return userId ? parseInt(userId, 10) : null;
};

const Quizzes: React.FC = () => {
  const [completedQuizzes, setCompletedQuizzes] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchCompletionStatus = async () => {
      const userId = getUserId();
      const token = getToken();
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      const completionStatus: { [key: number]: boolean } = {};

      for (const quiz of quizzes) {
        try {
          const response = await fetch(
            `http://localhost:8080/completed-quizzes?userId=${userId}&quizId=${quiz.id}`,
            {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const isCompleted = await response.json();
            completionStatus[quiz.id] = isCompleted;
          } else {
            console.error(
              `Failed to fetch completion status for quiz ${quiz.id}`
            );
          }
        } catch (error) {
          console.error(
            `Error fetching completion status for quiz ${quiz.id}:`,
            error
          );
        }
      }

      setCompletedQuizzes(completionStatus);
    };

    fetchCompletionStatus();
  }, []);

  return (
    <div className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 flex-fill justify-content-center align-items-center flex-wrap justify-content-xxl-center align-items-xxl-center">
      {quizzes.map((quiz) => (
        <Link
          key={quiz.id}
          to={quiz.path}
          className="d-flex d-xxl-flex flex-row flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-center flex-wrap justify-content-xxl-center align-items-xxl-center mx-3 py-4 px-4 my-3"
          style={{
            borderStyle: "solid",
            borderColor: completedQuizzes[quiz.id] ? "green" : "var(--bs-body-bg)",
            borderRadius: "1em",
            width: "80%",
            textDecoration: "none",
          }}
        >
          <h1
            className="my-0"
            style={{ color: "var(--bs-body-bg)", textAlign: "center" }}
          >
            {quiz.id}. {quiz.title}
          </h1>
        </Link>
      ))}
    </div>
  );
};

export default Quizzes;
