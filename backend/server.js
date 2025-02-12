const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow requests from your frontend
app.use(express.json()); // Parse JSON bodies

app.get("/", (req, res) => {
  res.send("Server is Running");
});

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
