const { acceptFriend, deleteYourFriend } = require("../services/friendService");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/index");
const Friend = require("../models/friendModel");
const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequestModel");

module.exports.addFriend = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new BadRequestError("please provide userid");
  }

  const result = await acceptFriend(req.user._id, userId);

  console.log({
    receiverId: { $eq: req.user._id },
    senderId: { $eq: userId },
  });

  await FriendRequest.deleteOne({
    $and: [
      { receiverId: { $eq: req.user._id } },
      { senderId: { $eq: userId } },
    ],
  });

  res.status(StatusCodes.ACCEPTED).json({
    result,
  });
};

module.exports.deleteFriend = async (req, res) => {
  const result = await deleteYourFriend(req.user._id, req.params.id);

  if (!result) {
    throw new BadRequestError("Something went wrong");
  }

  res.sendStatus(StatusCodes.NO_CONTENT);
};

module.exports.getFriendList = async (req, res) => {
  const _id = req.user._id;

  const friendList = await Friend.aggregate([
    { $project: { _id: 0, userIds: 1 } },
    {
      $match: {
        userIds: { $in: [_id] },
      },
    },
    {
      $unwind: "$userIds",
    },
    {
      $match: { userIds: { $ne: _id } },
    },
    {
      $group: { _id: null, userIds: { $push: "$userIds" } },
    },
    {
      $lookup: {
        from: "users",
        localField: "userIds",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $replaceWith: "$user" },
    {
      $project: {
        _id: 1,
        email: 1,
        avatar: 1,
        name: 1,
      },
    },
  ]);

  res.status(StatusCodes.OK).json(friendList);
};

module.exports.getInviteList = async (req, res) => {
  let inviteList = await FriendRequest.aggregate([
    {
      $match: {
        receiverId: { $eq: req.user._id },
      },
    },
  ]);

  inviteList = await FriendRequest.populate(inviteList, {
    path: "receiverId",
    select: "name avatar email",
  });

  inviteList = await FriendRequest.populate(inviteList, {
    path: "senderId",
    select: "name avatar email",
  });

  res.status(StatusCodes.OK).json(inviteList);
};

module.exports.getRequestList = async (req, res) => {
  let requestList = await FriendRequest.aggregate([
    {
      $match: {
        senderId: { $eq: req.user._id },
      },
    },
  ]);

  requestList = await FriendRequest.populate(requestList, {
    path: "receiverId",
    select: "name avatar email",
  });

  requestList = await FriendRequest.populate(requestList, {
    path: "senderId",
    select: "name avatar email",
  });

  res.status(StatusCodes.OK).json(requestList);
};

module.exports.createRequest = async (req, res) => {
  const { receiverId } = req.body;

  if (!receiverId) {
    throw new BadRequestError("Please provide receiverId");
  }

  const user = await User.find({ _id: receiverId });

  const existRequest = await FriendRequest.findOne({
    receiverId,
    senderId: req.user._id,
  });

  if (existRequest) {
    throw new BadRequestError("You already sent request");
  }

  let request = await FriendRequest.create({
    receiverId,
    senderId: req.user._id,
  });

  request = await FriendRequest.populate(request, {
    path: "receiverId",
    select: "name avatar email",
  });

  request = await FriendRequest.populate(request, {
    path: "senderId",
    select: "name avatar email",
  });

  if (!request) {
    throw new BadRequestError("Something went wrong");
  }

  res.status(StatusCodes.OK).json(request);
};

module.exports.deleleRequest = async (req, res) => {
  const requestId = req.params.id;

  const request = await FriendRequest.findOne({
    _id: requestId,
    $or: [
      { receiverId: { $eq: req.user._id } },
      { senderId: { $eq: req.user._id } },
    ],
  });

  if (!request) {
    throw new BadRequestError("I cant find this request");
  }

  await FriendRequest.deleteOne({
    _id: requestId,
    $or: [
      { receiverId: { $eq: req.user._id } },
      { senderId: { $eq: req.user._id } },
    ],
  });

  res.sendStatus(StatusCodes.NO_CONTENT);
};
