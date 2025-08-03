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
      const response = await axios.post("/ask", {
        query: question, // send as JSON
      });

      setAnswer(response.data);
    } catch (error) {
      console.error("Error fetching answer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <form onSubmit={handleAsk} className="flex flex-col gap-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Asking..." : "Ask"}
        </button>
      </form>

      {answer && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h2 className="font-bold">Answer:</h2>
          <p>{answer.answer}</p>
        </div>
      )}
    </div>
  );
};

export default AskQuestion;
