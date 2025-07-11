require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Roboflow = require("roboflow"); // ← stor R

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

const rf = new Roboflow({ apiKey: process.env.ROBOFLOW_API_KEY }); // ← stor R her
const project = rf.workspace().project("ai-removals-roboflow");
const model = project.version(2).model;

app.post("/analyze-video", upload.single("file"), async (req, res) => {
  try {
    const videoPath = req.file.path;

    const result = await model.predictVideo(videoPath, {
      fps: 5,
      prediction_type: "batch"
    });

    fs.unlinkSync(videoPath);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to analyze video");
  }
});

app.listen(8080, () => {
  console.log("Backend server running on port 8080");
});
