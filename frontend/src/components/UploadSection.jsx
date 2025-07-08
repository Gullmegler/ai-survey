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
    formData.append("file", file);

    try {
      const response = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/ai-removals-roboflow/2",
        params: {
          api_key: "o3WdaTWO4nd5tH71DoXz",
        },
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResults(response.data);
      setError("");
    } catch (err) {
      console.error("Error during analysis:", err);
      setError("Noe gikk galt under analysen.");
    }
  };

  return (
    <section className="text-center py-10">
      <input type="file" onChange={handleFileChange} accept="image/*,video/*" />
      {previewUrl && (
        <div className="mt-4">
          {file.type.startsWith("video") ? (
            <video src={previewUrl} controls className="mx-auto max-w-md" />
          ) : (
            <img src={previewUrl} alt="Preview" className="mx-auto max-w-md" />
          )}
          <button
            onClick={handleAnalyze}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            Analyze
          </button>
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {results && (
        <pre className="text-left mt-4 bg-gray-100 p-4 rounded">
          {JSON.stringify(results, null, 2)}
        </pre>
      )}
    </section>
  );
}

