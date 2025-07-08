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
          api_key: "YOUR_API_KEY", // Sett din egen API-nøkkel her
        },
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResults(response.data.predictions || []);
    } catch (err) {
      setError("Error analyzing image");
      console.error(err);
    }
  };

  // Telle antall per klasse
  const classCounts = {};
  results.forEach((pred) => {
    if (classCounts[pred.class]) {
      classCounts[pred.class]++;
    } else {
      classCounts[pred.class] = 1;
    }
  });

  return (
    <div className="flex flex-col items-center w-full">
      <input type="file" onChange={handleFileChange} />
      {previewUrl && (
        <div className="relative mt-4 flex justify-center">
          <img src={previewUrl} alt="Preview" className="max-w-full h-auto" />
          {results.map((pred, index) => (
            <div
              key={index}
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
                background: "rgba(255, 165, 0, 0.2)",
              }}
            >
              {pred.class} ({(pred.confidence * 100).toFixed(1)}%)
            </div>
          ))}
        </div>
      )}
      {file && (
        <button
          onClick={handleAnalyze}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded"
        >
          Analyze
        </button>
      )}

      {Object.keys(classCounts).length > 0 && (
        <div className="mt-6 text-center">
          <h2 className="font-bold mb-2">Detected items:</h2>
          <ul className="list-disc list-inside">
            {Object.entries(classCounts).map(([className, count], index) => (
              <li key={index}>
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
