const express = require("express");
const protect = require("../middlewares/protect-routes");
const { searchUser } = require("../controllers/userController");

const router = express.Router();

router.route("/").get(protect, searchUser);

module.exports = router;
