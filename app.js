const express = require("express");
const app = express();
const authRouter = require("./routes/authRoutes");
const projectRouter = require("./routes/projectRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);

app.use("*", (req, res, next) => {
  throw new AppError(`can't find ${req.originalUrl} on this server.`, 404);
});

app.use(globalErrorHandler);

module.exports = app;
