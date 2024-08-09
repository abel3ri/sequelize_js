const express = require("express");

const app = express();
const authRouter = require("./routes/authRoutes");

app.use("/api/v1/auth", authRouter);

app.get("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "route not found!",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
