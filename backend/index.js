const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Test endpoint
app.get('/', (req, res) => {
  res.send('AI Survey Backend is running');
});

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  const imagePath = req.file?.path;

  if (!imagePath) {
    return res.status(400).json({ error: 'Image not provided or failed to upload.' });
  }

  console.log(`➡️ Fil mottatt: ${imagePath}`);

  const formData = new FormData();
  formData.append('file', fs.createReadStream(imagePath));

  try {
    const roboflowRes = await axios.post(
      'https://detect.roboflow.com/ai-removals-roboflow/2?api_key=3WdaTWO4nd5tH71DoXz',
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 10000 // 10 sek timeout
      }
    );

    console.log('✅ Roboflow-response mottatt');
    res.json(roboflowRes.data);
  } catch (err) {
    console.error('❌ Roboflow-anrop feilet:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
      res.status(500).json({
        error: 'Feil ved Roboflow-analyse',
        status: err.response.status,
        response: err.response.data
      });
    } else {
      console.error('Feilmelding:', err.message);
      res.status(500).json({ error: 'Intern serverfeil', details: err.message });
    }
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
