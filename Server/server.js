const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;
const dotenv = require("dotenv");

dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  try {
    res.json({
      message: "Server is running successfully 🚀",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(port, () => {
  console.log(`🚀 Server running on PORT: ${port}`);
});
