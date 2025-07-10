import React, { useState } from "react";
import axios from "axios";

export default function UploadSection() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResults(null);
      setError("");
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:8080/api/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResults(response.data);
      setError("");
    } catch (err) {
      console.error("Error during analysis:", err);
      setError("Failed to analyze image.");
    }
  };

  return (
    <section className="text-center py-10">
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="mb-4"
      />
      {previewUrl && (
        <div className="mb-4">
          <img src={previewUrl} alt="Preview" className="mx-auto max-w-md" />
          <button
            onClick={handleAnalyze}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            Analyze
          </button>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {results && (
        <pre className="text-left mt-4 bg-gray-100 p-4 rounded overflow-x-auto">
          {JSON.stringify(results, null, 2)}
        </pre>
      )}
    </section>
  );
}
