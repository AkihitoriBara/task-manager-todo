require("dotenv").config(); // what it do

// Redirect all console output to server.log for easier debugging
require("./utils/logger");

const express = require("express");

const app = express();

// Routes
const authRoute = "./routes/auth.routes";
const userRoute = "./routes/user.routes";
const taskRoute = "./routes/task.routes";

app.use(express.json()); // what it do

// Log every incoming request
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

app.use("/api/auth", require(authRoute));
app.use("/api/users", require(userRoute));
app.use("/api/tasks", require(taskRoute));

const PORT = 5000;

app.get("/test", (req, res) => {
  res.send("test route works");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
