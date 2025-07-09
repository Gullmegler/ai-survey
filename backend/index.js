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

// Konfigurer multer til å lagre opplastede filer i "uploads" mappen
const upload = multer({ dest: 'uploads/' });

// Test-endepunkt
app.get('/', (req, res) => {
  res.send('AI Survey Backend is running');
});

// Analyse-endepunkt
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  const imagePath = req.file.path;

  const formData = new FormData();
  formData.append('file', fs.createReadStream(imagePath));

  try {
    const roboflowRes = await axios.post(
      'https://detect.roboflow.com/ai-removals-roboflow/2?api_key=3WdaTWO4nd5tH71DoXz',
      formData,
      { headers: formData.getHeaders() }
    );

    // Send JSON-resultatet tilbake til frontend eller curl
    res.json(roboflowRes.data);
  } catch (err) {
    console.error("Roboflow-feil:", err.message);
    res.status(500).json({ error: "Klarte ikke å analysere bildet." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
