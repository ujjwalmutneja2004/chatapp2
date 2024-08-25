const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if authorization header is present and starts with "Bearer"
    if (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Extract token from the header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request object
            req.user = await User.findById(decoded.id).select("-password");

            // Proceed to next middleware or route handler
            next();
        } catch (error) {
            // Handle token verification errors
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        // Handle missing token
        res.status(401).json({ message: "Not authorized, no token" });
    }
});

module.exports = protect
