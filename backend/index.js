require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

app.post("/analyze-video", upload.single("file"), async (req, res) => {
  try {
    const videoPath = req.file.path;

    // Les fil og konverter til base64
    const fileData = fs.readFileSync(videoPath, { encoding: "base64" });

    // Send forespørsel til Roboflow
    const response = await axios({
      method: "POST",
      url: `https://detect.roboflow.com/ai-removals-roboflow/2`,
      params: {
        api_key: process.env.ROBOFLOW_API_KEY
      },
      data: fileData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    // Slett fil etter analyse
    fs.unlinkSync(videoPath);

    res.json(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send("Failed to analyze video");
  }
});

app.listen(8080, () => {
  console.log("Backend server running on port 8080");
});
