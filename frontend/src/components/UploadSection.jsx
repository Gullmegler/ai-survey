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
        url: "https://detect.roboflow.com/ai-removals-roboflow/2",
        params: {
          api_key: "rf_TltRUahajLP6EsczNRGh4ecYCVy2"
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
    <div>
      <input type="file" onChange={handleFileChange} />
      {previewUrl && (
        <div>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%" }} />
          <button onClick={handleAnalyze}>Analyze</button>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {results.length > 0 && (
        <div>
          <h3>Results:</h3>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
