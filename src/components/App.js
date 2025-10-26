import React, { useEffect, useState } from "react";
import QuestionList from "./QuestionList";
import QuestionForm from "./QuestionForm";

function App() {
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(true); // ✅ show by default

  useEffect(() => {
    let isMounted = true;
    fetch("http://localhost:4000/questions")
      .then((r) => r.json())
      .then((data) => {
        if (isMounted) setQuestions(data);
      })
      .catch((err) => console.error("Error fetching questions:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ Add Question
  function handleAddQuestion(newQ) {
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQ),
    })
      .then((r) => r.json())
      .then((savedQ) => setQuestions((prev) => [...prev, savedQ]));
  }

  // ✅ Delete Question
  function handleDeleteQuestion(id) {
    fetch(`http://localhost:4000/questions/${id}`, { method: "DELETE" })
      .then(() => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
      });
  }

  // ✅ Update Question (instant + fetch)
  function handleUpdateQuestion(id, correctIndex) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, correctIndex } : q
      )
    );

    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex }),
    });
  }

  return (
    <main>
      <button onClick={() => setShowQuestions((prev) => !prev)}>
        {showQuestions ? "Hide Questions" : "View Questions"}
      </button>

      {showQuestions && (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      )}

      <QuestionForm onAddQuestion={handleAddQuestion} />
    </main>
  );
}

export default App;
