const express = require("express");
const protect = require("../middlewares/protect-routes");
const {
  searchUser,
  changeInformation,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").get(protect, searchUser);
router.route("/changeInfo").patch(protect, changeInformation);

module.exports = router;
