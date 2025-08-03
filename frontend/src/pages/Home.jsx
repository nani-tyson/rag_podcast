import React, { useState } from "react";
import UploadForm from "../components/UploadForm";
import ResponseCard from "../components/ResponseCard";
import axios from "../api/axios";
import Loader from "../components/Loader";

const Home = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("/ask", { query });
      setResponse(res.data);
    } catch (err) {
      console.error("Error fetching answer", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setIsUploaded(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white px-4 py-10 flex flex-col items-center">
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400 mb-6 text-center tracking-tight drop-shadow-md">
        🎧 Podcast Insight Assistant
      </h1>

      {/* Instruction Card */}
      <div className="w-full max-w-4xl mb-10 px-4 sm:px-0">
        <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] rounded-2xl border border-gray-700 backdrop-blur-lg p-6 sm:p-8 shadow-xl transition-all duration-300 hover:shadow-blue-700/40">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">
            📌 Supported Input Types
          </h2>
          <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
            <li className="flex items-start gap-2">
              <span className="text-green-400 text-lg">✔</span>
              <span>
                Public{" "}
                <strong className="text-white">YouTube podcast links</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 text-lg">✔</span>
              <span>
                Direct{" "}
                <strong className="text-white">audio/video file links</strong>{" "}
                (.mp3, .mp4, .m4a, .wav)
              </span>
            </li>
            <li className="hover:bg-gray-800 px-3 py-2 rounded transition-all duration-200">
              ⏳{" "}
              <span className="text-yellow-400 font-medium">
                Processing video/audio may take up to 5 minutes
              </span>{" "}
              depending on file length
            </li>
          </ul>
        </div>
      </div>

      {/* Upload URL */}
      <div className="w-full max-w-2xl">
        <UploadForm onSuccess={handleUploadSuccess} />
      </div>

      {/* Ask Section */}
      {isUploaded && (
        <div className="w-full max-w-2xl mt-10 animate-fade-in">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask something insightful about the podcast..."
            className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            rows={4}
          ></textarea>
          <button
            onClick={handleAsk}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200 font-semibold text-white w-full sm:w-auto"
          >
            Ask
          </button>
        </div>
      )}

      {/* Loader */}
      {loading && <Loader />}

      {/* Answer */}
      {response && (
        <div className="mt-10 w-full max-w-3xl">
          <ResponseCard response={response} />
        </div>
      )}
    </div>
  );
};

export default Home;
