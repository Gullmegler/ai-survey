import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function UploadSection() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

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
      setError("");
    } catch (err) {
      console.error(err);
      setError("Noe gikk galt under analysen.");
    }
  };

  useEffect(() => {
    if (!results || !previewUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = previewUrl;
    image.onload = () => {
      // Juster canvas størrelse til bildet
      canvas.width = image.width;
      canvas.height = image.height;

      // Tegn bilde først
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, image.width, image.height);

      // Tegn bokser
      results.forEach((item) => {
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          item.x - item.width / 2,
          item.y - item.height / 2,
          item.width,
          item.height
        );

        ctx.fillStyle = "orange";
        ctx.font = "16px Arial";
        ctx.fillText(
          `${item.class} (${(item.confidence * 100).toFixed(1)}%)`,
          item.x - item.width / 2,
          item.y - item.height / 2 - 5
        );
      });
    };
  }, [results, previewUrl]);

  return (
    <section className="text-center py-10">
      <input type="file" onChange={handleFileChange} className="mb-4" />
      {previewUrl && (
        <div className="mb-4">
          <canvas ref={canvasRef} style={{ maxWidth: "100%" }} />
        </div>
      )}
      <button
        onClick={handleAnalyze}
        className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
      >
        Analyze
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results && (
        <div className="mt-6 text-left max-w-md mx-auto">
          <h3 className="font-bold mb-2">Detected items:</h3>
          <ul className="list-disc pl-5">
            {results.map((item, index) => (
              <li key={index}>
                <strong>{item.class}</strong> — Confidence: {(item.confidence * 100).toFixed(1)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
