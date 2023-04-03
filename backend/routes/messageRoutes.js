const express = require("express");
const protect = require("../middlewares/protect-routes");
const {
  newMessage,
  allMessages,
  allImages,
} = require("../controllers/messageControler");

const router = express.Router();

router.use(protect);

router.route("/newMessage").post(newMessage);
router.route("/:chatId").get(allMessages);
router.route("/images/:chatId").get(allImages);

module.exports = router;
