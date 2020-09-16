const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// connect to Database

connectDB();

// Init Middleware for body Parser
app.use(express.json({ extended: false }));

app.use(cors());

app.get("/", (req, res) => res.send("Api running"));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

app.listen(PORT, () => console.log(`Server running on  port ${PORT}`));
