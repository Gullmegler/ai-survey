import React, { useState } from "react";
import axios from "axios";

export default function UploadSection() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResults([]);
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
        url: `https://detect.roboflow.com/ai-removals-roboflow/2?api_key=rf_TltRUahajLP6EsczNRGh4ecYCVy2`,
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
      <button
        onClick={handleAnalyze}
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
      >
        Analyze
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {results.length > 0 && (
        <div className="mt-4">
          <h3>Analysis Results:</h3>
          <pre className="text-left">{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
