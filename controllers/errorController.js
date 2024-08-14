const sequelize = require("sequelize");
const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message;
  const stack = err.stack;

  return res.status(statusCode).json({
    status,
    message,
    stack,
  });
};

const sendErrorProd = (err, res) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message;

  if (err.isOperational) {
    return res.status(statusCode).json({
      status,
      message,
    });
  }

  console.log(err.name, err.message, err.stack);

  return res.status(500).json({
    status: "error",
    message: "something went wrong",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  if (err.name === "SequelizeUniqueConstraintError") {
    const errorMsgs = err.errors.map((e) => e.message).join(", ");
    err = new AppError(errorMsgs, 400);
  } else if (err.name === "SequelizeValidationError") {
    const errorMsgs = err.errors.map((e) => e.message).join(", ");
    err = new AppError(errorMsgs, 400);
  } else if (err.name === "JsonWebTokenError") {
    err = new AppError("invalid token", 400);
  }
  if (process.env.NODE_ENV == "development") {
    return sendErrorDev(err, res);
  }

  return sendErrorProd(err, res);
};

module.exports = globalErrorHandler;
