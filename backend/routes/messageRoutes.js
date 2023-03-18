const express = require("express");
const protect = require("../middlewares/protect-routes");
const { newMessage, allMessages } = require("../controllers/messageControler");

const router = express.Router();

router.use(protect);

router.route("/newMessage").post(newMessage);
router.route("/:chatId").get(allMessages);

module.exports = router;
