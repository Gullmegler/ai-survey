import React, { useState } from "react";
import axios from "axios";

const UploadSection = () => {
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

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const base64String = reader.result.split(",")[1]; // fjerner data:image/... header

        const response = await axios({
          method: "POST",
          url: "https://serverless.roboflow.com/ai-removals-roboflow/2",
          params: {
            api_key: "o3WdaTWO4nd5tH71DoXz"
          },
          data: base64String,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
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

    reader.readAsDataURL(file);
  };

  return (
    <div className="text-center my-8">
      <input type="file" onChange={handleFileChange} />
      {previewUrl && (
        <div className="my-4">
          <img src={previewUrl} alt="Preview" className="mx-auto max-h-96" />
        </div>
      )}
      <button
        onClick={handleAnalyze}
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Analyze
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {/* Du kan også vise results her hvis du vil */}
    </div>
  );
};

export default UploadSection;
