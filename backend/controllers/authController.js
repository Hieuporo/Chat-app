const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnAuthenticatedError } = require("../errors/index");

module.exports.signup = async (req, res) => {
  const { avatar, password, email, name } = req.body;

  if (!password || !email || !name)
    throw new BadRequestError("Please provide all fields");

  const user = await User.create({
    avatar,
    password,
    email,
    name,
  });

  res.status(StatusCodes.CREATED).json({
    name: user.name,
    email: user.email,
    token: user.getToken(),
    _id: user._id,
    avatar: user.avatar,
  });
};

module.exports.login = async (req, res) => {
  const { password, email } = req.body;

  if (!password || !email)
    throw new BadRequestError("Please provide all fields");

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new BadRequestError("Email or password is incorrect");
  }

  if (await user.correctPassword(password)) {
    user.password = undefined;

    return res.status(StatusCodes.OK).json({
      name: user.name,
      email: user.email,
      token: user.getToken(),
      _id: user._id,
      avatar: user.avatar,
    });
  } else {
    throw new UnAuthenticatedError("Wrong email or password. Please try again");
  }
};
