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
} = require("../controllers/chatController");

const router = express.Router();

router.use(protect);

router.route("/").get(getChats);
router.route("/accessChat").post(accessChat);
router.route("/group").post(createGroupChat);
router.route("/rename").patch(renameGroup);
router.route("/removeMember").delete(removeFormGroup);
router.route("/addMember").patch(addToGroup);
router.route("/changeAvatar").patch(changeGroupAvatar);
module.exports = router;
