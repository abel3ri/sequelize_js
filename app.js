const express = require("express");
const app = express();
const authRouter = require("./routes/authRoutes");

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/auth", authRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "route not found!",
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    status: "error",
    message: err.message,
  });
});

module.exports = app;
