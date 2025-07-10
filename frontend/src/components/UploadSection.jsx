import React, { useState } from "react";
import axios from "axios";

const UploadSection = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // Handle image file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setResults([]);
    setError("");
  };

  // Analyze image (direct to Roboflow)
  const handleAnalyzeImage = async () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Image = reader.result.split(",")[1];
        const response = await axios({
          method: "POST",
          url: "https://detect.roboflow.com/ai-removals-roboflow/2",
          params: {
            api_key: "rf_TltRUahajLP6EsczNRGh4ecYCVy2",
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

  // Analyze video (send to backend)
  const handleAnalyzeVideo = async () => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("video", file);
      const response = await axios.post("http://localhost:8080/analyze-video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
      {previewUrl && <img src={previewUrl} alt="Preview" className="mx-auto my-4 max-h-64" />}
      <button onClick={handleAnalyzeImage} className="bg-orange-500 text-white px-4 py-2 m-2 rounded">Analyze Image</button>
      <button onClick={handleAnalyzeVideo} className="bg-blue-500 text-white px-4 py-2 m-2 rounded">Analyze Video</button>
      {error && <p className="text-red-500">{error}</p>}
      {results.length > 0 && <pre>{JSON.stringify(results, null, 2)}</pre>}
    </div>
  );
};

export default UploadSection;
