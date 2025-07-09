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
  res.send('✅ Backend kjører.');
});

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  console.log('📥 Mottatt POST /api/analyze');

  if (!req.file) {
    console.error('❌ Ingen fil mottatt i req.file');
    return res.status(400).json({ error: 'Ingen fil ble lastet opp.' });
  }

  const imagePath = req.file.path;
  console.log('📂 Bildesti mottatt:', imagePath);

  const formData = new FormData();
  formData.append('file', fs.createReadStream(imagePath));

  try {
    console.log('⏳ Ringer Roboflow...');
    const roboflowRes = await axios.post(
      'https://detect.roboflow.com/ai-removals-roboflow/2?api_key=3WdaTWO4nd5tH71DoXz',
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 15000
      }
    );
    console.log('✅ Roboflow ferdig');
    res.json(roboflowRes.data);
  } catch (err) {
    console.error('❌ Roboflow-feil:', err.message);
    if (err.response) {
      console.error('↩️ Feil fra Roboflow:', err.response.status, err.response.data);
      res.status(500).json({ error: 'Roboflow feilet', details: err.response.data });
    } else {
      res.status(500).json({ error: 'Intern feil', details: err.message });
    }
  } finally {
    fs.unlink(imagePath, () => {});
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
