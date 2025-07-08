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

  const [supplies, setSupplies] = useState([]);
  const [summary, setSummary] = useState({ cubicFeet: 0, weight: 0, truckSize: '' });

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

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/analyze',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setResult(response.data);
      calculateSuppliesAndSummary(response.data.objects || []);
    } catch (err) {
      console.error(err);
      setError('Noe gikk galt under analysen.');
    } finally {
      setLoading(false);
    }
  };

  const calculateSuppliesAndSummary = (items) => {
    let volume = 0;
    let weight = 0;
    let supplyList = [];

    items.forEach((item) => {
      switch (item.toLowerCase()) {
        case 'grand-piano':
          volume += 90;
          weight += 500;
          supplyList.push('2 flyttetepper', '1 stroppesett');
          break;
        case 'piano-chair':
          volume += 15;
          weight += 40;
          supplyList.push('1 mellomstor eske');
          break;
        case 'ceiling-lamp':
          volume += 5;
          weight += 10;
          supplyList.push('boblekonvolutt', 'skuminnlegg');
          break;
        default:
          supplyList.push('Standard eske');
          break;
      }
    });

    const truckSize = volume > 100 ? '16 ft truck' : '12 ft van';
    setSupplies(supplyList);
    setSummary({ cubicFeet: volume, weight, truckSize });
  };

  const downloadPDF = () => {
    alert('PDF-generering med AI Removals branding kommer her.');
  };

  const addToCRM = () => {
    fetch('https://crm.airemovals.co.uk/api/add-job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: result?.objects, summary }),
    })
      .then((res) => res.json())
      .then(() => alert('Lagret i CRM!'))
      .catch(() => alert('Feil ved CRM-integrasjon'));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <div className="space-x-2">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Analyserer...' : 'Analyze'}
          </Button>
          <Button onClick={downloadPDF}>Download PDF</Button>
          <Button onClick={addToCRM}>Add to CRM</Button>
        </div>
      </div>

      {previewUrl && (
        <div className="border rounded overflow-hidden max-w-md">
          <img src={previewUrl} alt="Preview" className="w-full object-contain" />
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent>
              <h2 className="text-lg font-bold mb-2">Detected Items</h2>
              <ul className="list-disc list-inside">
                {result.objects?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-lg font-bold mb-2">Supply Items</h2>
              <ul className="list-disc list-inside">
                {supplies.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-lg font-bold mb-2">Summary</h2>
              <p><strong>Cubic Feet:</strong> {summary.cubicFeet}</p>
              <p><strong>Weight (lb):</strong> {summary.weight}</p>
              <p><strong>Truck Size:</strong> {summary.truckSize}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
