import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const FundamentalsOfGraphTheory: React.FC = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/tutorials/fundamentals-of-graph-theory.md")
      .then((response) => response.text())
      .then((text) => setContent(text));

    console.log(content);
  }, []);

  return (
    <div style={{ padding: "20px", color: 'var(--bs-body-bg)' }}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default FundamentalsOfGraphTheory;
