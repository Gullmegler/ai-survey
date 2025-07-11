import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/analyze-image", async (req, res) => {
  try {
    const base64Image = req.body.image;
    const apiKey = process.env.ROBOFLOW_API_KEY;

    const response = await axios({
      method: "POST",
      url: "https://detect.roboflow.com/ai-removals-roboflow/2",
      params: {
        api_key: apiKey,
      },
      data: base64Image,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to analyze image" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
