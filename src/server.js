require("dotenv").config(); // what it do

const express = require("express");

const app = express();

// Routes
const authRoute = "./routes/auth.routes";
const userRoute = "./routes/user.routes";
const taskRoute = "./routes/task.routes";

app.use(express.json()); // what it do

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
