// src/pages/Home.jsx
import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import ResponseCard from '../components/ResponseCard';
import axios from '../api/axios';
import Loader from '../components/Loader';

const Home = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('/ask', { query });
      setResponse(res.data);
    } catch (err) {
      console.error('Error fetching answer', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setIsUploaded(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">🎙 Podcast RAG Assistant</h1>

      <UploadForm onSuccess={handleUploadSuccess} />

      {isUploaded && (
        <div className="mt-8 animate-fade-in">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask something..."
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 resize-none"
            rows={3}
          ></textarea>
          <button
            onClick={handleAsk}
            className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition duration-200"
          >
            Ask
          </button>
        </div>
      )}

      {loading && <Loader />}

      {response && (
        <div className="mt-6">
          <ResponseCard response={response} />
        </div>
      )}
    </div>
  );
};

export default Home;
