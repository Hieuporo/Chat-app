const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors/index");
const validator = require("validator");
module.exports.searchUser = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const user = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  res.status(StatusCodes.OK).json(user);
};

module.exports.changeInformation = async (req, res) => {
  const { name, email, avatar } = req.body;

  if (!name || !email || !email) {
    throw new BadRequestError("Please provide all fields");
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      email,
      name,
      avatar,
    },
    { new: true }
  );

  res.status(StatusCodes.OK).json(user);
};
