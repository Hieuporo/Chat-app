const express = require("express");
const protect = require("../middlewares/protect-routes");
const {
  addFriend,
  deleteFriend,
  getFriendList,
  getInviteList,
  createRequest,
  deleleRequest,
  getRequestList,
} = require("../controllers/friendController");

const router = express.Router();

router.use(protect);

router.route("/").get(getFriendList).post(addFriend);
router.route("/invite").get(getInviteList);
router.route("/request").get(getRequestList);
router.route("/invite/createRequest").post(createRequest);
router.route("/invite/delelteRequest/:id").delete(deleleRequest);
router.route("/:id").delete(deleteFriend);

module.exports = router;
