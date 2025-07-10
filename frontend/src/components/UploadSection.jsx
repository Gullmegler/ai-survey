import React, { useState } from "react";
import axios from "axios";

function UploadSection() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    setFile(newFile);
    setPreviewUrl(URL.createObjectURL(newFile));
    setResults([]);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios({
        method: "POST",
        url: "https://serverless.roboflow.com/ai-removals-roboflow/2",
        params: {
          api_key: "rf_TltRUahajLP6EsczNRGh4ecYCVy2",
        },
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResults(response.data.predictions || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image.");
      setResults([]);
    }
  };

  return (
    <div className="text-center my-8">
      <input type="file" onChange={handleFileChange} />
      {previewUrl && (
        <div className="flex justify-center mt-4">
          <img src={previewUrl} alt="Preview" className="max-w-md" />
        </div>
      )}
      <button
        onClick={handleAnalyze}
        className="bg-orange-500 text-white px-4 py-2 mt-4 rounded hover:bg-orange-600"
      >
        Analyze
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {results.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Results:</h3>
          <pre className="text-left">{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default UploadSection;
