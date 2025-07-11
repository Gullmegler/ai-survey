import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";

const UploadSection = () => {
  const [allResults, setAllResults] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [email, setEmail] = useState("");
  const [crmStatus, setCrmStatus] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleAnalyzeImages = async () => {
    try {
      for (const file of selectedFiles) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result.split(",")[1];
          const response = await axios({
            method: "POST",
            url: "https://detect.roboflow.com/ai-removals-roboflow/2",
            params: {
              api_key: "DIN_API_KEY"
            },
            data: base64,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          });
          setAllResults((prev) => [...prev, { type: "image", name: file.name, result: response.data }]);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      setError("Feil under bildeanalyse");
    }
  };

  const handleAnalyzeVideos = async () => {
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post("http://localhost:8080/analyze-video", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setAllResults((prev) => [...prev, { type: "video", name: file.name, result: response.data }]);
      }
    } catch (err) {
      setError("Feil under videoanalyse");
    }
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(allResults);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "results.csv");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    allResults.forEach((res, i) => {
      doc.text(`${i + 1}: ${res.type} - ${res.name}`, 10, 10 + i * 10);
    });
    doc.save("results.pdf");
  };

  const checkCRM = () => {
    if (email.includes("existing")) {
      setCrmStatus("exists");
    } else {
      setCrmStatus("new");
    }
  };

  const confirmCRM = () => {
    alert("Resultater lagt til i CRM");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <input type="file" multiple onChange={handleFileChange} className="mb-4" />
        <div className="flex justify-center space-x-4">
          <button onClick={handleAnalyzeImages} className="bg-blue-500 text-white px-4 py-2 rounded">Analyze Images</button>
          <button onClick={handleAnalyzeVideos} className="bg-green-500 text-white px-4 py-2 rounded">Analyze Videos</button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Results</h3>
        <ul className="list-disc pl-5">
          {allResults.map((r, i) => (
            <li key={i}>{r.type} - {r.name}</li>
          ))}
        </ul>
        <div className="flex space-x-2 mt-4">
          <button onClick={downloadCSV} className="bg-blue-500 text-white px-3 py-2 rounded">Download CSV</button>
          <button onClick={downloadPDF} className="bg-green-500 text-white px-3 py-2 rounded">Download PDF</button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Add to CRM</h3>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button onClick={checkCRM} className="bg-purple-500 text-white px-3 py-2 rounded">Check CRM</button>

        {crmStatus === "exists" && (
          <div className="mt-2">
            User exists. Add results?
            <button onClick={confirmCRM} className="ml-2 bg-green-600 text-white px-3 py-1 rounded">Yes</button>
          </div>
        )}

        {crmStatus === "new" && (
          <div className="mt-2">
            User not found. Create new?
            <button onClick={confirmCRM} className="ml-2 bg-green-600 text-white px-3 py-1 rounded">Yes</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
