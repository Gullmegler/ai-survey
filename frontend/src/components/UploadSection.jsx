import React, { useState } from "react";
import axios from "axios";

const UploadSection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResults([]);
    setError("");
  };

  const handleAnalyzeImage = async () => {
    if (!selectedFile) {
      setError("Please select an image file.");
      return;
    }
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(",")[1];
        const response = await axios({
          method: "POST",
          url: "https://detect.roboflow.com/ai-removals-roboflow/2",
          params: {
            api_key: "o3WdaTWO4nd5tH71DoXz"
          },
          data: base64,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
        setResults(response.data);
      };
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError("Image analysis failed.");
    }
  };

  const handleAnalyzeVideo = async () => {
    if (!selectedFile) {
      setError("Please select a video file.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post("http://localhost:5000/analyze-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setResults(response.data);
    } catch (err) {
      setError("Video analysis failed.");
    }
  };

  return (
    <div className="text-center mt-8">
      <input type="file" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="Preview" className="mx-auto mt-4 max-h-64" />}
      <div className="flex justify-center space-x-4 mt-4">
        <button onClick={handleAnalyzeImage} className="bg-blue-500 text-white px-4 py-2 rounded">
          Analyze Image
        </button>
        <button onClick={handleAnalyzeVideo} className="bg-green-500 text-white px-4 py-2 rounded">
          Analyze Video
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {results && (
        <div className="mt-4 text-left mx-auto max-w-xl">
          <h3>Results:</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
