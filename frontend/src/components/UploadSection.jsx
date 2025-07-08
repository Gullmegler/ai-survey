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
      });

      setResults(response.data.predictions);
    } catch (err) {
      setError("Failed to analyze image");
      console.error(err);
    }
  };

  // Tell classes
  const classCounts = {};
  if (results) {
    results.forEach((pred) => {
      if (classCounts[pred.class]) {
        classCounts[pred.class]++;
      } else {
        classCounts[pred.class] = 1;
      }
    });
  }

  return (
    <div className="text-center">
      <input type="file" onChange={handleFileChange} />
      {previewUrl && (
        <div className="mt-4 flex justify-center relative">
          <img src={previewUrl} alt="Preview" className="max-w-full h-auto" />
          {results &&
            results.map((pred, idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: `${pred.x - pred.width / 2}px`,
                  top: `${pred.y - pred.height / 2}px`,
                  width: `${pred.width}px`,
                  height: `${pred.height}px`,
                  border: "2px solid orange",
                  color: "orange",
                  fontSize: "12px",
                  fontWeight: "bold",
                  pointerEvents: "none",
                  background: "rgba(0,0,0,0.3)",
                  textAlign: "center",
                }}
              >
                {pred.class} ({(pred.confidence * 100).toFixed(1)}%)
              </div>
            ))}
        </div>
      )}
      <button
        onClick={handleAnalyze}
        className="mt-4 bg-orange-500 text-white px-4 py-2 rounded"
      >
        Analyze
      </button>

      {results && (
        <div className="mt-6 text-left max-w-md mx-auto">
          <h3 className="font-bold">Detected items:</h3>
          <ul className="list-disc list-inside">
            {Object.entries(classCounts).map(([className, count]) => (
              <li key={className}>
                <strong>{className}</strong> — {count} stk
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
