require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authMiddleware = require("./middleware/authMiddleware");
const taskRoutes = require("./routes/taskRoutes");
const taskLogRoutes = require("./routes/taskLogRoutes");

// Connect DB
connectDB();

const app = express();

app.use(
  cors({
    origin: "*", // later restrict to your frontend URL
  })
);
app.use(express.json());
app.use("/api/tasks", taskRoutes);
app.use("/api/habits", require("./routes/habits"));
app.use("/api/tasklogs", taskLogRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});