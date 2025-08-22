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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white px-6 py-10 flex flex-col items-center">
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-10 drop-shadow-lg text-center">
        Podcast Insight Assistant
      </h1>

      {/* Upload Section */}
      <div className="w-full max-w-xl bg-gray-800/60 rounded-2xl p-6 shadow-lg border border-gray-700 backdrop-blur-md">
        <h2 className="text-lg font-semibold text-blue-300 mb-4">
          Upload Podcast
        </h2>
        <UploadForm onSuccess={handleUploadSuccess} />
        <p className="mt-3 text-xs text-gray-400">
          Supported: YouTube links, .mp3, .mp4, .m4a, .wav files
        </p>
      </div>

      {/* Ask Section */}
      {isUploaded && (
        <div className="w-full max-w-xl mt-10 bg-gray-800/60 rounded-2xl p-6 shadow-lg border border-gray-700 backdrop-blur-md animate-fade-in">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask something insightful..."
            className="w-full p-4 rounded-xl bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            rows={4}
          ></textarea>
          <button
            onClick={handleAsk}
            disabled={loading}
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition duration-200 font-semibold w-full sm:w-auto"
          >
            {loading ? "Processing..." : "Ask"}
          </button>
        </div>
      )}

      {/* Loader */}
      {loading && <Loader />}

      {/* Answer */}
      {response && (
        <div className="mt-10 w-full max-w-2xl">
          <ResponseCard response={response} />
        </div>
      )}
    </div>
  );
};

export default Home;
