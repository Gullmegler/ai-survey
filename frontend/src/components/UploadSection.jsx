import React, { useState } from "react";
import axios from "axios";

const UploadSection = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const handleAnalyzeImage = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Image = reader.result.split(",")[1];
        const response = await axios({
          method: "POST",
          url: "https://detect.roboflow.com/ai-removals-roboflow/2",
          params: {
            api_key: process.env.REACT_APP_ROBOFLOW_API_KEY,
          },
          data: base64Image,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
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
    reader.readAsDataURL(file);
  };

  const handleAnalyzeVideo = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8080/analyze-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResults(response.data.predictions || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to analyze video.");
      setResults([]);
    }
  };

  return (
    <div className="text-center mt-8">
      <input type="file" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="Preview" className="mx-auto mt-4 max-h-64" />}
      <div className="flex justify-center space-x-4 mt-4">
        <button onClick={handleAnalyzeImage} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Analyze Image
        </button>
        <button onClick={handleAnalyzeVideo} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Analyze Video
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {results.length > 0 && (
        <div className="mt-4 text-left mx-auto max-w-xl">
          <h3>Results:</h3>
          <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
