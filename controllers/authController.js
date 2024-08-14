const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const User = require("../db/models/user");
const AppError = require("../utils/appError");

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

  // check if the userType is in ["1", "2"]
  if (!["buyer", "seller"].includes(userType)) {
    return next(new AppError("invalid userType"));
  }

  // create new user and save it to database
  const newUser = await User.create({
    userType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  });

  // remove password and deletedAt properties before sending user data
  const user = newUser.toJSON();
  delete user.password;
  delete user.deletedAt;

  if (!user) {
    return next(new AppError("failed to create a user", 400));
  }

  // generate token and send it to the newly created user
  const token = generateToken(user.id);

  res.status(201).json({
    status: "success",
    token,
    user,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check is the body contains email and password
  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }

  // find a user with the provided email
  const result = await User.findOne({
    where: {
      email,
    },
    attributes: {
      exclude: ["deletedAt", "passwordChangedAt"],
    },
  });

  // check if user exists and the password is correct
  if (!result || !(await result.validatePassword(password))) {
    return next(new AppError("incorrect email or password", 401));
  }

  const user = result.toJSON();

  delete user.password;

  const token = generateToken(result.id);

  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

const authenticate = catchAsync(async (req, res, next) => {
  // check if the header contains authorization and if so starts with 'Bearer'
  if (!(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))) {
    return next(new AppError("please login to get access", 401));
  }

  // decode the token
  const token = req.headers.authorization.split(" ")[1];

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

  const user = await User.findByPk(decoded.id);

  // find the user belonging to the token
  if (!user) {
    return next(new AppError("the user belonging to this token no longer exists", 401));
  }

  // check if the user does not changed password after the token has been issued
  if (user.passwordChangedAfter(decoded.iat)) {
    return next(new AppError("user recently changed password. please login again"), 401);
  }

  // set user property on the req object
  req.user = user.toJSON();

  return next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userType)) {
      return next(new AppError("you don't have permission to perform this action", 403));
    }
    return next();
  };
};

module.exports = {
  signup,
  login,
  authenticate,
  restrictTo,
};
