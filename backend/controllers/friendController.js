const { acceptFriend, deleteYourFriend } = require("../services/friendService");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/index");
const Friend = require("../models/friendModel");

module.exports.addFriend = async (req, res) => {
  const result = await acceptFriend(req.user._id, req.params.id);

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
      },
    },
  ]);

  res.status(StatusCodes.OK).json(friendList);
};
