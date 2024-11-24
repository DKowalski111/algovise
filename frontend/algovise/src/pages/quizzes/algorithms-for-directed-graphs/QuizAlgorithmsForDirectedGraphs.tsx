import React, { useState, useEffect } from "react";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

interface QuizData {
  quizTitle: string;
  quizId: number;
  questions: Question[];
}

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getUserId = (): number | null => {
  const userId = localStorage.getItem("id");
  return userId ? parseInt(userId, 10) : null;
};

const getToken = (): string | null => {
  return localStorage.getItem("token");
};

const QuizAlgorithmsForDirectedGraphs: React.FC = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, number | null>>(new Map());
  const [submitted, setSubmitted] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState<Map<number, boolean>>(new Map());
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  useEffect(() => {
    fetch("/quizzes/algorithms-for-directed-graphs/algorithms-for-directed-graphs.json")
      .then((response) => response.json())
      .then((data) => {
        const shuffledData = {
          ...data,
          questions: data.questions.map((question: { answers: any[] }) => ({
            ...question,
            answers: shuffleArray(question.answers),
          })),
        };
        setQuizData(shuffledData);
      })
      .catch((error) => console.error("Error loading quiz data:", error));
  }, []);

  const handleAnswerClick = (questionId: number, answerIndex: number) => {
    if (submitted) return;

    setSelectedAnswers((prevSelected) => {
      const updatedAnswers = new Map(prevSelected);
      updatedAnswers.set(questionId, answerIndex);
      return updatedAnswers;
    });
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    if (!quizData) {
      console.error("Quiz data not available.");
      return;
    }

    const newSubmittedAnswers = new Map<number, boolean>();
    let localCorrectAnswersCount = 0;
    setCorrectAnswersCount(0);

    quizData.questions.forEach((question) => {
      const selectedAnswerIndex = selectedAnswers.get(question.id);
      const isCorrect = question.answers[selectedAnswerIndex ?? -1]?.isCorrect ?? false;
      newSubmittedAnswers.set(question.id, isCorrect);

      if (isCorrect) {
        localCorrectAnswersCount++;
      }
    });

    setSubmittedAnswers(newSubmittedAnswers);
    setCorrectAnswersCount(localCorrectAnswersCount);

    const allCorrect = Array.from(newSubmittedAnswers.values()).every((correct) => correct);

    if (allCorrect) {
      const userId = getUserId();
      const token = getToken();

      if (!userId || !token) {
        console.error("User ID or token not found.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/completed-quizzes?userId=${userId}&quizId=5`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          console.log("Quiz marked as completed.");
        } else {
          console.error("Failed to mark quiz as completed:", response.statusText);
        }
      } catch (error) {
        console.error("Error marking quiz as completed:", error);
      }
    } else {
      console.log("Some answers are incorrect. Quiz not marked as completed.");
    }

    setIsPopupVisible(true);
  };

  const handleTryAgain = () => {
    window.location.reload();
  };

  if (!quizData) {
    return <div>Loading quiz...</div>;
  }

  return (
    <div className="d-flex d-xxl-flex flex-column flex-grow-1 flex-shrink-1 flex-fill justify-content-center align-items-center flex-wrap justify-content-xxl-center align-items-xxl-center">
      <div
        className={`popup-overlay ${isPopupVisible ? "visible" : ""}`}
        onClick={() => setIsPopupVisible(false)}
      />

      {isPopupVisible && (
        <div className="popup">
          <h1>Your score is</h1>
          <p>{correctAnswersCount} / {quizData.questions.length}</p>
          <button
            className="btn btn-primary"
            onClick={() => setIsPopupVisible(false)}
          >
            OK
          </button>
        </div>
      )}
      {quizData.questions.map((question, index) => (
        <div
          key={question.id}
          className="d-flex d-xxl-flex flex-column mx-3 py-4 px-4 my-3 justify-content-center align-items-center align-content-center"
        >
          <div
            className="d-flex d-xxl-flex flex-row flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-center flex-wrap"
            style={{
              borderRadius: "1em",
              width: "80%",
              borderStyle: "solid",
              borderColor: "var(--bs-primary)",
            }}
          >
            <h1
              className="my-0"
              style={{ color: "var(--bs-body-bg)", textAlign: "center" }}
            >
              {index + 1}. {question.question}
            </h1>
          </div>

          <div
            className="d-flex flex-row flex-grow-1 flex-shrink-1 flex-fill justify-content-center align-items-center align-content-center flex-wrap"
            style={{ width: "100%" }}
          >
            {question.answers.map((answer, answerIndex) => {
              const isSelected = selectedAnswers.get(question.id) === answerIndex;
              const isSubmitted = submittedAnswers.has(question.id);
              const isCorrect = answer.isCorrect;

              const borderColor = isSubmitted
                ? isSelected && isCorrect
                  ? "green"
                  : isSelected && !isCorrect
                    ? "red"
                    : "var(--bs-warning)"
                : isSelected
                  ? "var(--bs-info)"
                  : "var(--bs-warning)";

              return (
                <div
                  key={answerIndex}
                  className="d-flex d-xxl-flex flex-row flex-grow-1 flex-shrink-1 justify-content-center align-items-center align-content-center flex-wrap mx-3 py-4 px-4 my-3"
                  style={{
                    borderRadius: "1em",
                    borderStyle: "solid",
                    borderColor: borderColor,
                    width: "40%",
                    cursor: submitted ? "not-allowed" : "pointer",
                  }}
                  onClick={() => handleAnswerClick(question.id, answerIndex)}
                >
                  <h1
                    className="my-0"
                    style={{ color: "var(--bs-body-bg)", textAlign: "center" }}
                  >
                    {answerIndex + 1}. {answer.text}
                  </h1>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-center mt-4">
        {submitted ? (
          <button
            onClick={handleTryAgain}
            className="btn btn-secondary"
            style={{ padding: "10px 20px", fontSize: "16px", borderRadius: "10px" }}
          >
            Try Again
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ padding: "10px 20px", fontSize: "16px", borderRadius: "10px" }}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizAlgorithmsForDirectedGraphs;
