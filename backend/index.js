const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AI Survey Backend is running');
});

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  const imagePath = req.file.path;

  try {
    const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });

    const response = await axios.post(
      'https://detect.roboflow.com/ai-moving/2?api_key=o3WdaTWO4nd5tH71DoXz',
      imageData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const objectNames = response.data.predictions.map((p) => p.class);
    res.json({ objects: objectNames });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Kunne ikke analysere bildet.' });
  } finally {
    fs.unlinkSync(imagePath); // Rydd opp midlertidig fil
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
