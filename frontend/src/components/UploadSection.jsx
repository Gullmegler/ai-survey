import React, { useState } from "react";
import axios from "axios";

export default function AIMovingEstimator() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setPreviewUrl(URL.createObjectURL(uploadedFile));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:8080/api/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const predictions = response.data.predictions || [];
      const parsed = predictions.map((p) => `${p.class} (${Math.round(p.confidence * 100)}%)`);
      setResult(parsed);
    } catch (err) {
      console.error("Image analysis failed:", err);
      setError("Failed to analyze image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="Preview" className="max-w-md rounded-lg shadow" />}
      <button
        onClick={handleSubmit}
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      {error && <p className="text-red-600">{error}</p>}
      {result && (
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold">Detected Items:</h3>
          <ul>
            {result.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
