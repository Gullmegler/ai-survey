app.post('/api/analyze', upload.single('image'), async (req, res) => {
  const imagePath = req.file.path;

  try {
    const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });

    const roboflowRes = await axios.post(
      'https://serverless.roboflow.com/infer/workflows/test-vqiue/detect-count-and-visualize-2', // ← din workflow
      {
        api_key: process.env.ROBOFLOW_API_KEY,
        inputs: {
          image: {
            type: 'base64',
            value: base64Image
          }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(roboflowRes.data);
  } catch (error) {
    console.error('Feil fra Roboflow:', error.message);
    res.status(500).json({ error: 'Image analysis failed' });
  }
});
