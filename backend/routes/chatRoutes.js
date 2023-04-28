const express = require("express");
const protect = require("../middlewares/protect-routes");
const {
  accessChat,
  getChats,
  createGroupChat,
  renameGroup,
  removeFormGroup,
  addToGroup,
  changeGroupAvatar,
  leaveGroup,
} = require("../controllers/chatController");

const router = express.Router();

router.use(protect);

router.route("/").get(getChats);
router.route("/accessChat").post(accessChat);
router.route("/group").post(createGroupChat);
router.route("/rename").patch(renameGroup);
router.route("/removeMember").patch(removeFormGroup);
router.route("/addMember").patch(addToGroup);
router.route("/changeAvatar").patch(changeGroupAvatar);
router.route("/leaveGroup").patch(leaveGroup);
module.exports = router;
