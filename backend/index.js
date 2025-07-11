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

    // Last opp filen til Roboflow API
    const formData = new FormData();
    formData.append("file", fs.createReadStream(videoPath));

    const roboflowResponse = await axios({
      method: "post",
      url: `https://detect.roboflow.com/YOUR_MODEL/2?api_key=${process.env.ROBOFLOW_API_KEY}`,
      headers: formData.getHeaders(),
      data: formData
    });

    fs.unlinkSync(videoPath);
    res.json(roboflowResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to analyze video");
  }
});

app.listen(8080, () => {
  console.log("Backend server running on port 8080");
});
