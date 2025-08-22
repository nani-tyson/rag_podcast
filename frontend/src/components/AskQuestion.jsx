// src/components/AskQuestion.jsx
import { useState } from "react";
import axios from "../api/axios";

const AskQuestion = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer(null);

    try {
      const response = await axios.post("/ask", { query: question });
      setAnswer(response.data);
    } catch (error) {
      console.error("Error fetching answer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 px-4">
      <form
        onSubmit={handleAsk}
        className="flex flex-col sm:flex-row gap-3 bg-gray-900/60 p-4 rounded-2xl border border-gray-700 shadow-lg"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something insightful..."
          className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-xl text-white font-semibold transition"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {answer && (
        <div className="mt-8">
          <ResponseCard response={answer} />
        </div>
      )}
    </div>
  );
};

export default AskQuestion;
