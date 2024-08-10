const jwt = require("jsonwebtoken");
const bcyrpt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const User = require("../db/models/user");

const generateToken = (payload) => {
  return jwt.sign(
    {
      id: payload,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const signup = catchAsync(async (req, res, next) => {
  const { userType, firstName, lastName, email, password, confirmPassword } = req.body;

  if (!["1", "2"].includes(userType)) {
    return res.status(400).json({
      status: "fail",
      message: "invalid user type",
    });
  }

  const newUser = await User.create({
    userType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  });

  const user = newUser.toJSON();
  delete user.password;
  delete user.deletedAt;

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "failed to create a user",
    });
  }

  const token = generateToken(user.id);

  res.status(201).json({
    status: "success",
    token,
    data: user,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check is the body contains email and password
  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "please provide email and password",
    });
  }

  // find a user with the provided email
  const user = await User.findOne({
    where: {
      email,
    },
  });

  // check if user exists and the password is correct
  if (!user || !(await bcyrpt.compare(password, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "incorrect email or password",
    });
  }

  const token = generateToken(user.id);

  res.status(200).json({
    status: "success",
    token,
    message: "login route",
  });
});

module.exports = {
  signup,
  login,
};
