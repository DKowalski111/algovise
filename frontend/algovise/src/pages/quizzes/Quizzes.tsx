import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../../utils/AuthUtils";

interface Quiz {
  id: number;
  title: string;
}

const getUserId = (): number | null => {
  const userId = localStorage.getItem("id");
  return userId ? parseInt(userId, 10) : null;
};

const Quizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<{ [key: number]: boolean }>({});
  const [isUserAdmin, setIsUserAdmin] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = getToken();

      try {
        const response = await fetch("http://localhost:8080/quizzes/list", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data: Quiz[] = await response.json();
          setQuizzes(data);
        } else {
          console.error("Failed to fetch quizzes.");
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    const fetchAdminStatus = async () => {
      const token = getToken();
      try {
        const response = await fetch("http://localhost:8080/admin", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "text/plain",
          },
          body: token,
        });

        if (response.ok) {
          setIsUserAdmin(await response.json());
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    fetchQuizzes();
    fetchAdminStatus();
  }, []);

  useEffect(() => {
    if (quizzes.length === 0) return;

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
            console.error(`Failed to fetch completion status for quiz ${quiz.id}`);
          }
        } catch (error) {
          console.error(`Error fetching completion status for quiz ${quiz.id}:`, error);
        }
      }

      setCompletedQuizzes(completionStatus);
    };

    fetchCompletionStatus();
  }, [quizzes]);

  return (
    <div className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 flex-fill justify-content-center align-items-center flex-wrap justify-content-xxl-center align-items-xxl-center">
      {quizzes.map((quiz, index) => (
        <Link
          key={quiz.id}
          to={`/quizzes/${quiz.id}`}
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
            {index + 1}. {quiz.title}
          </h1>
        </Link>
      ))}
      {isUserAdmin && (
        <button
          className="btn btn-primary mx-4 my-3"
          type="button"
          onClick={() => navigate("/quiz-creator")}
        >
          Add new Quiz
        </button>
      )}
    </div>
  );
};

export default Quizzes;
