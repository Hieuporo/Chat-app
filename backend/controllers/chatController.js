const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { BadRequestError, NotFoundError } = require("../errors/index");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

module.exports.accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new BadRequestError("Provide userid to add friend");
  }

  let chat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  }).populate("users", "name avatar email");

  if (chat) {
    chat = await chat.populate("latestMessage");
    chat = await chat.populate({
      path: "latestMessage.sender",
      select: "name avatar email",
    });
    return res.status(StatusCodes.OK).json(chat);
  }

  chat = await Chat.create({
    users: [req.user._id, userId],
    chatName: "defaultChat",
  });

  const fullChat = await Chat.populate(chat, {
    path: "users",
    select: "name avatar email",
  });

  res.status(StatusCodes.CREATED).json(fullChat);
};

module.exports.getChats = async (req, res) => {
  let chats = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "name avatar email")
    .populate("latestMessage", "sender content")
    .sort({ updatedAt: -1 });

  res.status(StatusCodes.OK).json(chats);
};

module.exports.createGroupChat = async (req, res) => {
  let { users, chatName, chatAvatar } = req.body;

  if (!users || !chatName) {
    throw new BadRequestError("Please provide id member or chat name");
  }

  if (users.length < 2) {
    throw new BadRequestError("Please provide 2 members or more");
  }

  users = JSON.parse(users);

  users.push(req.user._id);

  let chat = await Chat.create({
    chatName,
    users,
    groupAdmin: req.user._id,
    isGroupChat: true,
    chatAvatar,
  });

  chat = await Chat.populate(chat, {
    path: "users",
    select: "name avatar email",
  });
  chat = await Chat.populate(chat, {
    path: "groupAdmin",
    select: "name avatar email",
  });

  res.status(StatusCodes.CREATED).json(chat);
};

module.exports.renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  if (!chatId || !chatName) {
    throw new BadRequestError("Please provide all fields");
  }

  const group = await Chat.findOne({ _id: chatId, isGroupChat: true })
    .populate("users", "name avatar email")
    .populate("users", "name avatar email");

  if (!group) {
    throw new NotFoundError("Can not find this chat");
  }

  group.chatName = chatName;
  group.save();

  res.status(StatusCodes.OK).json(group);
};

module.exports.changeGroupAvatar = async (req, res) => {
  const { chatId, chatAvatar } = req.body;

  if (!chatId || !chatAvatar) {
    throw new BadRequestError("Please provide all fields");
  }

  const group = await Chat.findOne({ _id: chatId, isGroupChat: true }).populate(
    "users",
    "name avatar email"
  );

  if (!group) {
    throw new NotFoundError("Can not find this chat");
  }

  group.chatAvatar = chatAvatar;
  group.save();

  res.status(StatusCodes.OK).json(group);
};

module.exports.removeFormGroup = async (req, res) => {
  const { userId, chatId } = req.body;

  if (!userId || !chatId) {
    throw new BadRequestError("Please provide all fields");
  }

  const chat = await Chat.findOne({
    _id: chatId,
    groupAdmin: req.user._id,
  }).populate("users", "name avatar email");

  const filterUser = chat.users.filter((user) =>
    user._id.equals(new mongoose.Types.ObjectId(userId))
  );

  if (filterUser.length === 0) {
    throw new BadRequestError("User is not in this group");
  }

  if (!chat) {
    throw new NotFoundError("Something went wrong!");
  }

  chat.users = chat.users.filter((user) => {
    if (!user._id.equals(new mongoose.Types.ObjectId(userId))) {
      return user;
    }
  });

  chat.save();

  res.status(StatusCodes.OK).json(chat);
};
module.exports.addToGroup = async (req, res) => {
  const { userId, chatId } = req.body;
  if (!userId || !chatId) {
    throw new BadRequestError("Please provide all fields");
  }

  const chat = await Chat.findOne({
    _id: chatId,
    groupAdmin: req.user._id,
  }).populate("users", "name email avatar");

  const filterUser = chat.users.filter((user) =>
    user._id.equals(new mongoose.Types.ObjectId(userId))
  );

  if (filterUser.length > 0) {
    throw new BadRequestError("User already in chat");
  }

  const userAdd = await User.findOne({ _id: userId });

  if (!userAdd) {
    throw new NotFoundError("Cant find this user");
  }

  if (!chat) {
    throw new NotFoundError("Something went wrong!");
  }

  chat.users.push(userAdd);

  chat.save();

  res.status(StatusCodes.OK).json(chat);
};
