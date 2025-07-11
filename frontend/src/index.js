import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./index.css";

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setResults([]);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Image = reader.result.split(",")[1];
        const response = await axios({
          method: "POST",
          url: "https://detect.roboflow.com/ai-removals-roboflow/2",
          params: {
            api_key: "rf_TltRUahajLP6EsczNRGh4ecYCVy2",
          },
          data: base64Image,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        setResults(response.data.predictions || []);
        setError("");
      } catch (err) {
        setError("Failed to analyze image.");
        setResults([]);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">AI Analyzer (Image)</h1>
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
      />
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="mx-auto mb-6 rounded shadow-lg"
        />
      )}
      <button
        onClick={handleAnalyze}
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded shadow-md mb-4"
      >
        Analyze Image
      </button>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="text-left whitespace-pre-wrap bg-gray-100 p-4 rounded shadow-inner">
        {results.length > 0 ? JSON.stringify(results, null, 2) : ""}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
