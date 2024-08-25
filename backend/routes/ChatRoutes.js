// const express = require("express");
// const router = express.Router();
// const accessChat = require("../controllers/chatControllers");
// const protect = require("../middlewares/authMiddleware");

// // Define the route and attach the middleware and handler function
// router.route('/').post(protect, accessChat);

// // Example routes
// // router.route('/').get(protect, fetchChats);
// // router.route('/group').post(protect, createGroupChat);
// // router.route('/rename').put(protect, renameGroup);
// // router.route('/groupremove').put(protect, removeFromGroup);
// // router.route('/groupremove').put(protect, addToGroup);

// module.exports = router;
const express = require("express");
const router = express.Router();
// const accessChat = require("../controllers/chatControllers"); // Ensure this points to the correct file
// const fetchChats = require("../controllers/chatControllers");
const { accessChat, fetchChats } = require("../controllers/chatControllers")
const protect = require("../middlewares/authMiddleware"); // Ensure this points to the correct file


// Define the route with proper middleware and handler function
router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
//outer.route("/group").post(protect,createGroupChat)

module.exports = router;
