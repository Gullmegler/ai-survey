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

      const predictions = response.data.predictions;
      setResults(predictions);
      setError("");
    } catch (err) {
      setError("Failed to analyze image.");
    }
  };

  const countByClass = results.reduce((acc, prediction) => {
    acc[prediction.class] = (acc[prediction.class] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col items-center">
      <input type="file" onChange={handleFileChange} />
      {previewUrl && (
        <div className="my-4 flex justify-center">
          <div style={{ position: "relative", display: "inline-block" }}>
            <img src={previewUrl} alt="Preview" />
            {results.map((prediction, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  border: "2px solid orange",
                  left: prediction.x - prediction.width / 2,
                  top: prediction.y - prediction.height / 2,
                  width: prediction.width,
                  height: prediction.height,
                  color: "orange",
                  fontWeight: "bold",
                  fontSize: "12px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)"
                }}
              >
                {`${prediction.class} (${Math.round(prediction.confidence * 100)}%)`}
              </div>
            ))}
          </div>
        </div>
      )}
      {file && (
        <button
          onClick={handleAnalyze}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Analyze
        </button>
      )}
      {Object.keys(countByClass).length > 0 && (
        <div className="mt-6 text-center">
          <h3 className="font-bold mb-2">Detected items:</h3>
          <ul className="list-disc list-inside">
            {Object.entries(countByClass).map(([className, count], index) => (
              <li key={index}>
                {className} — {count} stk
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
