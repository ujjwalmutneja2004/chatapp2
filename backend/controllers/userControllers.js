// const asyncHandler=require("express-async-handler")
// const User=require('../models/userModel')
// const generateToken=require('../config/generateToken')

// const registerUser = asyncHandler(async(req,res) => {
//     const { name, email, password, pic } = req.body;

//     if (!name || !email || !password) {
//         res.status(400);
//         throw new Error("please Enter all Fields")
//     }

//     const userExists = await User.findOne({ email });

//     if (userExists) {
//           res.status(400);
//         throw new Error("User already exists");
//     }

//     const user = await User.create({
//         name,
//         email,
//         password,
//         pic,
//     })

//     if (user) {
//         res.status(201).json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             pic: user.pic,
//             taken: generateToken(user._id)
//         });
//     }
//     else {
//         res.status(400);
//         throw new Error("Failed to Create user");
//     }
// });


// const authUser = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;
//     //  res.send('User authenticated');
//     const user = await User.findOne({ email });

//     if (user && (await user.matchPassword(password))) {
//         res.json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             pic: user.pic,
//             token: generateToken(user._id),
//         });
//         console.log("user authenticated");
//     }
//     else {
//         res.status(401);
//         throw new Error("Invalid Email or password");
//     }
// });


// //video 10
// //  api/user?search=ujjwal
// //regex for searching pattern and i for case insensitive
// const allUsers = asyncHandler(async (req, res) => {
//     const keyword = req.query.search
//         ?
//         {
//         $or: [
//             { name: { $regex: req.query.search, $options: "i" } },
//             { email: { $regex: req.query.search, $options: "i" } },
//         ],
//     }
//         : {};
    
//     console.log(keyword)
//     const users = await User.find(keyword) .find({ _id: { $ne: req.user._id } });
//     res.send(users);
// });


// module.exports = { registerUser, authUser, allUsers };

const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id), // Fixed: token should be returned instead of taken
        });
    } else {
        res.status(400);
        throw new Error("Failed to create user");
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
        console.log("User authenticated");
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});


//i want all users except this partcicular user
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

   // console.log(keyword);
    const users = await User.find({ ...keyword, _id: { $ne: req.user._id } });
    res.send(users);
});

module.exports = { registerUser, authUser, allUsers };
