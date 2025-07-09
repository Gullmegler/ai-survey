import React, { useState } from 'react';
import axios from 'axios';

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
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:8080/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const predictions = response.data.predictions || [];
      setResult(predictions);
    } catch (err) {
      console.error('Feil ved analyse:', err.message);
      setError('Failed to analyze image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center mt-8">
      <input type="file" onChange={handleFileChange} className="mb-4" />
      {previewUrl && <img src={previewUrl} alt="Preview" className="mx-auto mb-4 max-w-md" />}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {result && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Results:</h3>
          <pre className="text-left bg-gray-100 p-2 mt-2 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
