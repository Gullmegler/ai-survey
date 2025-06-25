
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('AI Survey Backend is running');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
