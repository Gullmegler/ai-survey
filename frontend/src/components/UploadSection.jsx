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
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setResults([]);
    setError("");
  };

  const handleImageAnalyze = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Image = reader.result.split(",")[1];
        const response = await axios({
          method: "POST",
          url: "https://detect.roboflow.com/ai-removals-roboflow/2",
          params: {
            api_key: "rf_TltRUahajLP6EsczNRGh4ecYCVy2", // publiserbar key
          },
          data: base64Image,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        console.log("Image response:", response.data);
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

  const handleVideoAnalyze = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8080/analyze-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Video response:", response.data);
      setResults(response.data.predictions || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to analyze video.");
      setResults([]);
    }
  };

  return (
    <div className="text-center my-8">
      <input type="file" onChange={handleFileChange} />
      {previewUrl && (
        <div className="my-4">
          <img src={previewUrl} alt="Preview" className="mx-auto max-h-96" />
        </div>
      )}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleImageAnalyze}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Analyze Image
        </button>
        <button
          onClick={handleVideoAnalyze}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Analyze Video
        </button>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {results.length > 0 && (
        <pre className="text-left mt-4 bg-gray-100 p-2 rounded max-w-xl mx-auto overflow-x-auto">
          {JSON.stringify(results, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default UploadSection;
