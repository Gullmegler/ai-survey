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
    } catch (error) {
      console.error('Feil ved analyse:', error.message);
      setError('Failed to analyze image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <input type="file" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="Preview" className="my-4 mx-auto max-w-md" />}
      <button
        onClick={handleSubmit}
        className="bg-orange-500 text-white py-2 px-6 rounded hover:bg-orange-600"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {result && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Predictions:</h3>
          <pre className="bg-gray-100 p-2 text-left rounded">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
