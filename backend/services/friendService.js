const Friend = require("../models/friendModel");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} = require("../errors/index");

module.exports.acceptFriend = async (_id, senderId) => {
  // Check if this invitation does not exist(chua lam)

  // await FriendRequest.checkByIds(senderId, _id);

  if (_id.toString() === senderId) {
    throw new BadRequestError("Something went wrong");
  }

  // check already a friend

  const check1 = await Friend.findOne({ userIds: [_id, senderId] });
  const check2 = await Friend.findOne({ userIds: [senderId, _id] });

  if (check1 || check2) {
    throw new BadRequestError("Already friend");
  }

  const friend = await Friend.create({ userIds: [_id, senderId] });

  if (!friend) {
    throw new BadRequestError("Something went wrong");
  }

  // accept and delele request

  return friend;
};

module.exports.deleteYourFriend = async (_id, friendId) => {
  const check1 = await Friend.findOne({ userIds: [_id, friendId] });
  const check2 = await Friend.findOne({ userIds: [friendId, _id] });

  if (!check1 && !check2) {
    throw new BadRequestError("This user is not your friend");
  }

  if (check1) {
    await Friend.deleteOne({ userIds: [_id, friendId] });
  } else {
    await Friend.deleteOne({ userIds: [friendId, _id] });
  }

  return true;
};
