const express = require("express");
const protect = require("../middlewares/protect-routes");
const {
  addFriend,
  deleteFriend,
  getFriendList,
} = require("../controllers/friendController");

const router = express.Router();

router.use(protect);

router.route("/").get(getFriendList);
router.route("/:id").get(addFriend).delete(deleteFriend);

module.exports = router;
