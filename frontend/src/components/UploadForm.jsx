// src/components/UploadForm.jsx
import { useState } from "react";
import axios from "../api/axios";
import Loader from "./Loader";

const UploadForm = ({ onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post("/upload-audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess(); // callback to refresh or show success
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="file"
        accept="audio/*"
        className="w-full p-2 border border-gray-300 rounded"
        onChange={e => setFile(e.target.files[0])}
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
