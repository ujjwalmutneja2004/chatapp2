const asyncHandler=require("express-async-handler")
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.status(400).send({ message: "UserId parameter is required" });
    }

    // Check if chat already exists
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
        //current user logged in and the user id that we are provided with
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
        //populate with all info except password
        //populate user array just remove password
    }).populate("users", "-password").populate("latestMessage");
   
    //popultae sender field
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        // Create new chat
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users", "-password"
            );
            //populate user array above

        res.status(200).send(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message );
        }
    }
});


const fetchChats = asyncHandler(async (req, res) => {
    try {
      Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
          res.status(200).send(results);
        });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });
  



// const fetchChats = asyncHandler(async (req, res) => {
//     try {
//         // Fetch all chats where this user is involved
//         Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
//             .populate("users", "-password")         // Populate users field excluding passwords
//             .populate("groupAdmin", "-password")    // Populate groupAdmin field (if applicable)
//             .populate("latestMessage")              // Populate latestMessage field
//             .sort({ updatedAt: -1 });               // Sort by most recent

//         // Populate the sender in the latestMessage
//         chats = await User.populate(chats, {
//             path: "latestMessage.sender",
//             select: "name pic email",
//         });

//         // Send the chats document as the response
//         res.status(200).send(chats);
//     } catch (error) {
//         console.error("Error fetching chats:", error); // Log the error for debugging
//         res.status(400).send({ message: error.message });
//     }
// });



// const createGroupChat=asyncHandler(async(req,res)=>{
//     if(!req.body.users||!req.body.name){
//         return res.status(400).send({message: "please fill all fields"});
//     }
//     var users=JSON.parse(req.body.users);

//     if(users.length < 2){
//         return res
//         .status(400)
//         .send("More than 2 users are required ")
//     }
// })

//module.exports = { accessChat, fetchChats ,createGroupChat };
module.exports = { accessChat, fetchChats};

