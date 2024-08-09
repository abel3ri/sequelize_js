const express = require("express");
const app = express();
const authRouter = require("./routes/authRoutes");

app.use("/api/v1/auth", authRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "route not found!",
  });
});

module.exports = app;
