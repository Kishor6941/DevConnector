const express = require("express");
const connectDB = require("./config/db");
const app = express();

// connect to Database

connectDB();

app.get("/", (req, res) => res.send("Api running"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on  port ${PORT}`));
