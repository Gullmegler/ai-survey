const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
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
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });

    const roboflowRes = await axios.post(
      'https://serverless.roboflow.com/ai-removals-roboflow/2?api_key=rf_TltRUahajJtP6EsczNRGh4ecYCYy2
',
      base64Image,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return res.json(roboflowRes.data);
  } catch (error) {
    console.error('Roboflow error:', error.message);
    return res.status(500).json({ error: 'Image analysis failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
