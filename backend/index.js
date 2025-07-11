require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

app.post("/analyze-video", upload.single("file"), async (req, res) => {
  try {
    const videoPath = req.file.path;

    const formData = new FormData();
    formData.append("file", fs.createReadStream(videoPath));

    const response = await axios({
      method: "post",
      url: `https://detect.roboflow.com/ai-removals-roboflow/2?api_key=${process.env.ROBOFLOW_API_KEY}`,
      headers: formData.getHeaders(),
      data: formData
    });

    fs.unlinkSync(videoPath);

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error);
    res.status(500).send("Failed to analyze video");
  }
});

app.listen(8080, () => {
  console.log("Backend server running on port 8080");
});
