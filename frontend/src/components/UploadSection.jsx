import React, { useState } from "react";
import axios from "axios";

export default function UploadSection() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResults([]);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios({
        method: "POST",
        url: "https://serverless.roboflow.com/ai-removals-roboflow/2",
        params: {
          api_key: "rf_TltRUahajLP6EsczNRGh4ecYCYv2"
        },
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setResults(response.data.predictions || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image.");
      setResults([]);
    }
  };

  return (
    <div className="text-center my-8">
      <input type="file" onChange={handleFileChange} />
      {previewUrl && (
        <div className="my-4">
          <img src={previewUrl} alt="Preview" className="mx-auto max-h-96" />
        </div>
      )}
      <button onClick={handleAnalyze} className="bg-orange-500 text-white px-4 py-2 rounded">
        Analyze
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
