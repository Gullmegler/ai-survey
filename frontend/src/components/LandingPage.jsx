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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResults(response.data.predictions);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Noe gikk galt under analysen.");
      setResults(null);
    }
  };

  return (
    <div className="text-center mt-12">
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
      {previewUrl && (
        <>
          {file.type.startsWith("video/") ? (
            <video
              src={previewUrl}
              controls
              className="mx-auto mt-4 max-w-md rounded shadow"
            />
          ) : (
            <img
              src={previewUrl}
              alt="Preview"
              className="mx-auto mt-4 max-w-md rounded shadow"
            />
          )}
          <button
            onClick={handleAnalyze}
            className="mt-4 bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 transition"
          >
            Analyze
          </button>
        </>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results && (
        <div className="mt-8 text-left max-w-2xl mx-auto bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Detected Objects:</h3>
          {results.length > 0 ? (
            <ul>
              {results.map((item, index) => (
                <li key={index}>
                  <strong>{item.class}</strong> (confidence: {(item.confidence * 100).toFixed(1)}%)
                </li>
              ))}
            </ul>
          ) : (
            <p>Ingen objekter funnet.</p>
          )}
        </div>
      )}
    </div>
  );
}
