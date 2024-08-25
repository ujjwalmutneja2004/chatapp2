const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const cors = require('cors');
const connectDB = require("./config/db")
// const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const  ChatRoutes  =require("./routes/ChatRoutes")


dotenv.config();
connectDB();
const app = express();

app.use(express.json());

app.use(cors());
app.get('/', (req, res) => {
    res.send("API is running Succesfully"); //to accept json file
})


app.get('/api/chat/:id',(req, res) => {
    //console.log(req.params.id);
    const singleChat = chats.find((c) => c._id === req.params.id);
    res.send(singleChat)
})

app.use('/api/user', userRoutes)
app.use('/api/chat',ChatRoutes)

app.use(notFound)
app.use(errorHandler)

//i dont want to make it public that our port is on 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
