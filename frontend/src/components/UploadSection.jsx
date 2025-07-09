import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AIMovingEstimator() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    setPreviewUrl(URL.createObjectURL(uploadedFile));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1]; // Fjerner metadata

      try {
        const response = await axios.post(
          'http://localhost:9001/infer/workflows/test-vqiue/detect-count-and-visualize-4',
          {
            api_key: 'o3WdaTWO4nd5tH71DoXz', // bytt til env-variabel i prod
            inputs: {
              image: {
                type: 'base64',
                value: base64Image,
              },
            },
          }
        );

        const predictions = response.data?.predictions || [];
        const objectClasses = predictions.map((p) => p.class);
        setResult(objectClasses);
      } catch (err) {
        console.error(err);
        setError('Failed to analyze image.');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <Card className="p-4 w-full max-w-xl mx-auto text-center">
      <CardContent>
        <h2 className="text-xl font-semibold mb-2">AI-Powered Moving Survey</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
        {previewUrl && <img src={previewUrl} alt="Preview" className="mx-auto mb-2 max-h-96" />}
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {result && (
          <div className="mt-4 text-left">
            <h3 className="font-bold">Detected Objects:</h3>
            <ul className="list-disc list-inside">
              {result.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
