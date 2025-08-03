// src/components/UploadForm.jsx
import { useState } from "react";
import axios from "../api/axios";
import Loader from "./Loader";

const UploadForm = ({ onSuccess }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/upload-audio", { url });
      onSuccess(); // callback to refresh or show success
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to process the URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Enter YouTube/Podcast URL"
        value={url}
        onChange={e => setUrl(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? <Loader /> : "Upload"}
      </button>
    </form>
  );
};

export default UploadForm;
