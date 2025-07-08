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

      setResults(response.data);
    } catch (err) {
      console.error(err);
      setError("Error analyzing image.");
    }
  };

  // Gruppér predictions etter class
  const grouped = {};
  if (results && results.predictions) {
    results.predictions.forEach((pred) => {
      if (!grouped[pred.class]) {
        grouped[pred.class] = [];
      }
      grouped[pred.class].push(pred);
    });
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>AI-Powered Moving Survey</h2>
      <p>Submit your moving image and see detected items with counts!</p>
      <input type="file" onChange={handleFileChange} />
      <br />
      {previewUrl && (
        <div style={{ position: "relative", display: "inline-block", marginTop: "10px" }}>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%" }} />
          {results &&
            results.predictions.map((pred, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: pred.x - pred.width / 2,
                  top: pred.y - pred.height / 2,
                  width: pred.width,
                  height: pred.height,
                  border: "2px solid orange",
                  color: "orange",
                  fontWeight: "bold",
                  fontSize: "12px",
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                {pred.class} ({(pred.confidence * 100).toFixed(1)}%)
              </div>
            ))}
        </div>
      )}
      <br />
      <button onClick={handleAnalyze} style={{ marginTop: "10px", padding: "8px 20px" }}>
        Analyze
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results && (
        <div style={{ textAlign: "left", maxWidth: "400px", margin: "20px auto" }}>
          <h3>Detected items:</h3>
          <ul>
            {Object.entries(grouped).map(([cls, preds], index) => (
              <li key={index}>
                <strong>{cls}</strong> — {preds.length} stk
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
