const UnAuthenticatedError = require("../errors/unauthenticated");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    throw new UnAuthenticatedError("You do not have permission right here");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({ _id: decoded.userId });

  // 4) Check user changed password after the token was issued
  if (user.changedPasswordAfter(decoded.iat)) {
    throw new UnAuthenticatedError(
      "User recently changed password! Please log in again"
    );
  }

  req.user = user;

  next();
};

module.exports = protect;
