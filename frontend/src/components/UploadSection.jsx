import React, { useState } from "react";
import axios from "axios";

function UploadSection() {
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
    reader.onloadend = async () => {
      try {
        const base64Image = reader.result.split(",")[1];
        const response = await axios({
          method: "POST",
          url: "https://detect.roboflow.com/ai-removals-roboflow/2",
          params: {
            api_key: "rf_TltRUahajLP6EsczNRGh4ecYCVy2", // Din publishable API key
          },
          data: base64Image,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        console.log("Response:", response.data);
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
      {previewUrl && <img src={previewUrl} alt="Preview" className="mx-auto my-4 max-h-64" />}
      <button
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        onClick={handleAnalyze}
      >
        Analyze
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {results.length > 0 && (
        <div className="mt-4">
          <h3>Results:</h3>
          <pre className="text-left">{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default UploadSection;
