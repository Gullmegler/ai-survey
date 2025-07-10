const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
require("dotenv").config();
const { Inference } = require("@roboflow/inference");

const app = express();
app.use(cors());
app.use(fileUpload());

const inference = new Inference(process.env.ROBOFLOW_API_KEY);

app.post("/analyze", async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileBuffer = req.files.file.data;

        const result = await inference.predict(fileBuffer, {
            model: "ai-removals-roboflow/2",
            confidence: 0.5
        });

        res.json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(8080, () => {
    console.log("Backend server running on port 8080");
});
