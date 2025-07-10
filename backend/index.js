const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { Roboflow } = require("roboflow");
require("dotenv").config();

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());
const PORT = 8080;

const rf = new Roboflow({ apiKey: process.env.ROBOFLOW_API_KEY });

app.post("/analyze-video", upload.single("video"), async (req, res) => {
  try {
    const project = await rf.workspace().project("ai-removals-roboflow");
    const model = await project.version(2).model;
    const job = await model.predictVideo(req.file.path, {
      fps: 5,
      confidence: 0.5,
      overlap: 0.2,
    });
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Video analysis failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
