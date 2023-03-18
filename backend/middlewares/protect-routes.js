const UnAuthenticatedError = require("../errors/unauthenticated");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    throw new UnAuthenticatedError("You do not have permission right here");
  }

  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    throw new UnAuthenticatedError("You do not have permission right here");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({ _id: decoded.userId });

  req.user = user;

  next();
};

module.exports = protect;
