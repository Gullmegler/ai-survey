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
  const imagePath = req.file.path;

  const formData = new FormData();
  formData.append('file', fs.createReadStream(imagePath));

  try {
    const roboflowRes = await axios.post(
      'https://detect.roboflow.com/ai-removals-roboflow/2?api_key=o3WdaTWO4nd5tH71DoXz',
      formData,
      { headers: formData.getHeaders() }
    );

    console.log("✅ Roboflow response:", roboflowRes.data);

    const predictions = roboflowRes.data.predictions.map(p => p.class);
    res.json({ objects: predictions });

  } catch (err) {
    console.error("❌ Roboflow error:", err?.response?.data || err.message);
    res.status(500).json({ error: 'Image analysis failed', details: err?.response?.data || err.message });
  } finally {
    fs.unlink(imagePath, () => {}); // rydder opp
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
