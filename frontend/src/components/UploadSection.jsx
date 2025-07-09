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
      console.error('Feil under analyse:', err.message);
      setError('Failed to analyze image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <input type="file" onChange={handleFileChange} />
      {previewUrl && (
        <div style={{ marginTop: '1rem' }}>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
      <button
        onClick={handleSubmit}
        style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', backgroundColor: '#f60', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Predictions:</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
