import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function UploadSection() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

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
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResults(response.data);
    } catch (err) {
      setError("Noe gikk galt under analysen.");
    }
  };

  useEffect(() => {
    if (results && previewUrl) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = imageRef.current;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        results.predictions.forEach((pred) => {
          const { x, y, width, height, class: label, confidence } = pred;
          ctx.strokeStyle = "#ff6600";
          ctx.lineWidth = 2;
          ctx.strokeRect(x - width / 2, y - height / 2, width, height);

          ctx.fillStyle = "#ff6600";
          ctx.font = "16px Arial";
          ctx.fillText(`${label} (${(confidence * 100).toFixed(1)}%)`, x - width / 2, y - height / 2 - 5);
        });
      };
    }
  }, [results, previewUrl]);

  return (
    <section className="text-center py-10">
      <input type="file" onChange={handleFileChange} accept="image/*,video/*" />
      {previewUrl && (
        <div className="relative mt-6 inline-block">
          <img ref={imageRef} src={previewUrl} alt="Preview" style={{ display: "none" }} />
          <canvas ref={canvasRef} className="max-w-full" />
        </div>
      )}
      <button
        onClick={handleAnalyze}
        className="mt-4 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
      >
        Analyze
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results && results.predictions && (
        <div className="mt-6 text-left max-w-lg mx-auto">
          <h3 className="text-xl font-semibold mb-2">Detected items:</h3>
          <ul className="list-disc list-inside">
            {results.predictions.map((pred, index) => (
              <li key={index}>
                <strong>{pred.class}</strong> — Confidence: {(pred.confidence * 100).toFixed(1)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
