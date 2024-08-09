const signup = (req, res, next) => {
  res.status(200).json({ status: "success", message: "sign up route" });
};

module.exports = {
  signup,
};
