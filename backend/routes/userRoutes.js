
// const { registerUser, authUser, allUsers } = require('../controllers/userControllers');
// const { protect }=require("../middlewares/authMiddleware")

// const express = require('express')
// //instance of router
// const router = express.Router()

// //single request get post
// //chain multiple request
// //this is end point after /api/user
// router.route("/").post(registerUser).get(protect , allUsers);
// router.post("/login", authUser)


// module.exports = router;

const { registerUser, authUser, allUsers } = require('../controllers/userControllers');
const protect = require("../middlewares/authMiddleware"); // Import correctly

const express = require('express');
const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers); // Make sure protect is correctly passed
router.post("/login", authUser);

module.exports = router;
