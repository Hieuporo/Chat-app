const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");

const { BadRequestError, NotFoundError } = require("../errors/index");
const { StatusCodes } = require("http-status-codes");

module.exports.newMessage = async (req, res) => {
  const { chatId, content, type } = req.body;

  if (!chatId || !content) {
    throw new BadRequestError("Something went wrong");
  }

  let message = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
    type,
  });

  message = await message.populate("sender", "name avatar");
  message = await message.populate("chat");
  message = await message.populate({
    path: "chat.users",
    select: "name avatar email",
  });

  await Chat.findByIdAndUpdate(req.body.chatId, {
    latestMessage: message,
  });

  res.status(StatusCodes.CREATED).json(message);
};

module.exports.allMessages = async (req, res) => {
  const { chatId } = req.params;

  let messages = await Message.find({ chat: chatId })
    .populate("sender")
    .populate("chat")
    .sort({ createdAt: 1 });

  res.status(StatusCodes.OK).json(messages);
};

module.exports.allImages = async (req, res) => {
  const { chatId } = req.params;

  let messages = await Message.find({ chat: chatId, type: "img" })
    .populate("chat")
    .sort({ createdAt: -1 });

  res.status(StatusCodes.OK).json(messages);
};
