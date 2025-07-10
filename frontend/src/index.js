import React, { useState } from "react";
import axios from "axios";
import ReactDOM from "react-dom";

function App() {
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
      <h1>AI Image Analyzer</h1>
      <input type="file" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="Preview" className="mx-auto my-4" />}
      <button onClick={handleAnalyze} style={{ background: "orange", color: "white", padding: "10px 20px" }}>
        Analyze
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {results.length > 0 && <pre>{JSON.stringify(results, null, 2)}</pre>}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.get
