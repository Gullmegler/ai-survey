import React, { useState } from "react";
import axios from "axios";

export default function UploadSection() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setPredictions([]);
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

      setPredictions(response.data.predictions);
      setError("");
    } catch (err) {
      setError("Error during analysis");
      console.error(err);
    }
  };

  // Gruppér predictions per klasse
  const grouped = predictions.reduce((acc, pred) => {
    if (!acc[pred.class]) acc[pred.class] = [];
    acc[pred.class].push(pred);
    return acc;
  }, {});

  return (
    <div className="flex flex-col items-center space-y-4">
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
      {previewUrl && (
        <div className="relative">
          <img src={previewUrl} alt="Preview" className="max-w-full h-auto" />
          {predictions.map((pred, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                border: "2px solid orange",
                left: pred.x - pred.width / 2,
                top: pred.y - pred.height / 2,
                width: pred.width,
                height: pred.height,
                color: "orange",
                fontSize: "12px",
                fontWeight: "bold",
                background: "rgba(0,0,0,0.5)",
              }}
            >
              {pred.class} ({(pred.confidence * 100).toFixed(1)}%)
            </div>
          ))}
        </div>
      )}
      <button
        onClick={handleAnalyze}
        className="px-4 py-2 bg-orange-500 text-white rounded"
      >
        Analyze
      </button>
      {predictions.length > 0 && (
        <div className="mt-4 text-left">
          <h3 className="font-bold">Detected items:</h3>
          <ul>
            {Object.entries(grouped).map(([cls, preds], index) => (
              <li key={index}>
                <strong>{cls}</strong> — {preds.length} stk (
                {preds
                  .map((p) => `${(p.confidence * 100).toFixed(1)}%`)
                  .join(", ")}
                )
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

