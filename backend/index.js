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

app.get('/', (req, res) => {
  res.send('AI Survey Backend is running');
});

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  const imagePath = req.file?.path;

  if (!imagePath) {
    return res.status(400).json({ error: 'Image not provided or failed to upload.' });
  }

  console.log(`📸 Mottatt bilde: ${imagePath}`);

  const formData = new FormData();
  formData.append('file', fs.createReadStream(imagePath));

  try {
    const roboflowRes = await axios.post(
      'https://detect.roboflow.com/ai-removals-roboflow/2?api_key=3WdaTWO4nd5tH71DoXz',
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 10000 // 10 sekunder timeout
      }
    );

    console.log('✅ Svar mottatt fra Roboflow');
    res.json(roboflowRes.data);
  } catch (err) {
    console.error('❌ Roboflow-feil:', err.message);

    if (err.response) {
      res.status(err.response.status).json({
        error: 'Roboflow feilet',
        status: err.response.status,
        message: err.response.data
      });
    } else if (err.code === 'ECONNABORTED') {
      res.status(504).json({ error: 'Tidsavbrudd – Roboflow svarte ikke i tide' });
    } else {
      res.status(500).json({ error: 'Intern serverfeil', details: err.message });
    }
  } finally {
    fs.unlink(imagePath, () => {
      console.log(`🧹 Midlertidig fil slettet: ${imagePath}`);
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
