 import React, { useState, useEffect } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Text, Box, IconButton, Spinner, FormControl, Input } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../../config/ChatLogics';
import ProfileModal from '../miscellenous/ProfileModal';
import UpdatedGroupChatModal from '../miscellenous/UpdatedGroupChat';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import './styles.css';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie'
import animationData from './../../animation/typing.json'
const defaultOptions ={
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSSettings: {
    preserveAspectRatio: "xMidYMid slice",
  }
}



const ENDPOINT = 'http://localhost:5000';
var  selectedChatCompare;
let socket=io();

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, SelectedChat, setSelectedChat ,notification,setNotification} = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();

  // Fetch messages when SelectedChat changes
  const fetchMessages = async () => {
    if (!SelectedChat) return;

    try {
     // console.log('Fetching messages for chat:', SelectedChat._id);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${SelectedChat._id}`,
        config
      );

      console.log('Messages fetched:', data);
      // Ensure the chat hasn't changed during the fetch
      if (SelectedChat._id) {
        setMessages(data);  // Update messages for the selected chat
      }
      setLoading(false);
      socket.emit("join chat", SelectedChat._id);
    } catch (error) {
    //  console.log('Error while fetching messages:', error);
      toast({
        title: 'Error Occurred!',
        description: 'Failed to fetch messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on('connected', () => setsocketConnected(true));
    socket.on('typing',()=>setIsTyping(true))
    socket.on('stop typing',()=>setIsTyping(false))
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = SelectedChat;
    // eslint-disable-next-line
  }, [SelectedChat]);

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      socket.emit('stop typing',SelectedChat._id)
      try {
     //   console.log('Sending message:', newMessage);
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };
         //change 
        setNewMessage("");
        const { data } = await axios.post(
          'http://localhost:5000/api/message',
          {
            content: newMessage,
            chatId: SelectedChat._id,
          },
          config
        );

     //   console.log('Message sent:', data);
        setNewMessage("");  // Reset input after sending
       setMessages((prevMessages) => [...prevMessages, data]);  // Append new message to chat

        if (socketConnected) {
          socket.emit("new message", data);  // Emit message to other users in the same chat room
        }
      //  socket.emit("new message", data);
    //    setMessages([...messages, data]);

      } catch (error) {
      //  console.log('Error while sending message:', error);
        toast({
          title: 'Error Occurred!',
          description: 'Failed to send message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    }
  };

  //console.log(notification,"...........")
useEffect(()=>{
  socket.on("message received", (newMessageReceived) => {
   
    if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
      if(!notification.includes(newMessageReceived)){
        setNotification([newMessageReceived,...notification])
        setFetchAgain(!fetchAgain)//ftech all chats again
      }
     
    } else {
      setMessages([...messages, newMessageReceived]);
    }
  });

})
 

  // useEffect(() => {
    
  // });

  //temparray of above
  // useEffect(() => {
  //   socket.on("message received", (newMessageReceived) => {
  //     if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
  //       // Optional: handle notifications for messages in other chats
  //     } else {
  //       // Append new message to the current list without re-rendering issues
  //       setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
  //     }
  //   });
  
  //   // Clean up the listener on component unmount to prevent memory leaks
  //   return () => {
  //     socket.off("message received");
  //   };
  // }, [selectedChatCompare]);
  

  // Handle typing input
  const typingHandler = (e) => {
   // console.log('Typing message:', e.target.value);
    setNewMessage(e.target.value);

    if(!socketConnected) return;

    if(!typing){
      setTyping(true)
      socket.emit("typing",SelectedChat._id)
    }
    let lastTypingTime=new Date().getTime()
    var timerLength=3000;
     setTimeout(()=>{
        var timeNow=new Date().getTime();
        var timeDiff=timeNow-lastTypingTime;

        if(timeDiff>=timerLength && typing){
          socket.emit("stop typing",SelectedChat._id);
          setTyping(false);
        }
     },timerLength)
  };

  return (
    <>
      {SelectedChat ? (
        <>
          <Text
            fontSize={{ base: '24px', md: '26px' }}
            pb={0}
            mt={2}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton
              display="flex"
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}  // Clear the selected chat
            />
            {!SelectedChat.isGroupChat ? (
              <>
                {getSender(user, SelectedChat.users)}
                <ProfileModal user={getSenderFull(user, SelectedChat.users)} />
              </>
            ) : (
              <>
                {SelectedChat.chatName.toUpperCase()}
                <UpdatedGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="98%"
            mt={2}
            h="90%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <ScrollableChat messages={messages} />
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {/* {isTyping?<div>Loading....</div>:<></>} */}
               {isTyping?<div><Lottie
                 options={defaultOptions}
                  width={70}
                 style={{marginLeft:"0",marginBottom:"15"}}  
                 /></div>:<></>}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="90%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on the user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;











// import React, { useState, useEffect } from 'react';
// import { ChatState } from '../../Context/ChatProvider';
// import { Text, Box, IconButton, Spinner, FormControl, Input } from '@chakra-ui/react';
// import { ArrowBackIcon } from '@chakra-ui/icons';
// import { getSender, getSenderFull } from '../../config/ChatLogics';
// import ProfileModal from '../miscellenous/ProfileModal';
// import UpdatedGroupChatModal from '../miscellenous/UpdatedGroupChat';
// import axios from 'axios';
// import { useToast } from '@chakra-ui/react';
// import './styles.css';
// import ScrollableChat from './ScrollableChat';
// import io from 'socket.io-client';

// // import { sendMessage } from '../../../backend/controllers/messageController'
// const ENDPOINT = "http://localhost:5000";
// var socket, selectedChatCompare;

// const SingleChat = ({fetchAgain , setFetchAgain}) => {
//   const[message, setMessage] = useState([]);
//   const[loading, setLoding] = useState(false);
//   const [newMessage, setNewMessage] = useState();
//   const [socketConnected, setSocketConnected] = useState(false);
//   const [typing, setTyping] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const toast = useToast();
//   const {user, SelectedChat, setSelectedChat} = ChatState();
  

// const fetchMessages = async()=>{
//   if(!SelectedChat) return;
//   try {
//     const config ={
//       headers:{
//         Authorization:`Bearer ${user.token}`,
//       },
//     }
//     setLoding(true);
//     const {data} = await axios.get(`http://localhost:5000/api/message/${SelectedChat._id},config`);
//     setMessage(data);
//     setLoding(false);
//     socket.emit("join chat",SelectedChat._id);
//   } catch (error) {
//     toast({
//       title:"Error Occured!",
//       description:"Failed to fetch messages",
//       status:"error",
//       duration:5000,
//       isClosable:true,
//       position:"bottom",
//     });
    
    
//   }
// }
// useEffect(()=>{
//   socket = io(ENDPOINT);
//   socket.emit("setup",user);
//   socket.on('connected',()=>setSocketConnected(true));
//   socket.on("typing",()=>setIsTyping(true));
//   socket.on("stop typing",()=>setIsTyping(false));
// },[])
// useEffect(()=>{
//   fetchMessages();
//   selectedChatCompare = SelectedChat;
// },[SelectedChat])

// useEffect(()=>{
//   socket.on("message received",(newMessageReceived)=>{
//     if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
//       // give nottification
//     } else{
//       setMessage([...message,newMessageReceived]);
//     }
//   })
// })
//   const sendMessage = async(event)=>{
//     if(event.key === "Enter" && newMessage){
//       socket.emit("stop typing",SelectedChat._id);
//      try {
//       const config = {
//         headers:{
//           "Content-Type":"application/json",
//           Authorization:`Bearer ${user.token}`,

//         },
//       };
//       setNewMessage("");
//       const {data} = await axios.post('http://localhost:5000/api/message',{
//         content:newMessage,
//         chatId:SelectedChat._id,
        
//       },config);
//       console.log(data);
//       socket.emit("new message",data);
      
//       setMessage([...message,data]);
//      } catch (error) {
//       toast({
//         title:"Error Occured!",
//         description:"Failed to send the message",
//         status:"error",
//         duration:5000,
//         isClosable:true,
//         position:"bottom",
//       });
      
//      }
//     }
//   }


//   const typingHandler = (e)=>{
//     setNewMessage(e.target.value);
//     // Typing Indicator logic
//     if(!socketConnected) return;
//     if(!typing){
//       setTyping(true);
//       socket.emit("typing",SelectedChat._id);
//     }
//     let lastTypingTime = new Date().getTime();
//     var timerLength = 3000;
//     setTimeout(()=>{
//       var timeNow = new Date().getTime();
//       var timeDiff = timeNow - lastTypingTime;
//       if(timeDiff >= timerLength && typing){
//         socket.emit("stop typing",SelectedChat._id);
//         setTyping(false);
//       }
//     },timerLength);
//   }
//     return (
    
//     <>
//       {SelectedChat ? (<>
//         <Text
//         fontSize={{ base: "28px", md: "30px" }}
//         pb={3}
//         px={2}
//         w="100%"
//         fontFamily="Work sans"
//         display="flex"
//         justifyContent={{base:"space-between"}}
//         alignItems="center"
//         >
//           <IconButton
//           d={{base: "flex", md: "none"}}
//           icon={<ArrowBackIcon/>}
//           onClick={()=>setSelectedChat("")}
//           />
//           {!SelectedChat.isGroupChat ?(
//             <>
//               {getSender(user,SelectedChat.users)}
//               <ProfileModal user={getSenderFull(user,SelectedChat.users)}/>
//             </>
//           ):(
//             <>{SelectedChat.chatName.toUpperCase()}
//               {<UpdatedGroupChatModal
//                 fetchAgain={fetchAgain}
//                 setFetchAgain={setFetchAgain}
//                 fetchMessages={fetchMessages}
//               />}
//             </>
//           )}
         
//         </Text>
//         <Box
//         d="flex"
//         flexDir="column"
//         justifyContent="flex-end"
//         p={3}
//         bg="#E8E8E8"
//         w="100%"
//         h="100%"
//         borderRadius="lg"
//         overflowY="hidden"
//         >
//           {loading ? (
//             <Spinner
//             size="xl"
//             w={20}
//             h={20}
//             alignSelf="center"
//             margin="auto"
//             />
//           ):(
//             <div className='messages'>
//               <ScrollableChat messages={message}/>
//             </div>
//           )
//         }
//         <FormControl onKeyDown={sendMessage} isRequired mt={3}>
//         {isTyping ? <div>Loading...</div>:<></>}
//         <Input
//         variant="filled"
//         bg = "#E0E0E0"
//         placeholder='Enter a message...'
//         onChange={typingHandler}
//         value={newMessage}
//         />
//         </FormControl>
         
//         </Box>
          
//       </>
//       ):(
//         <Box display="flex" alignItems="center" justifyContent="center" h="100%"> 
//         <Text fontSize="3xl" pb={3} fontFamily="Work sans" > Click on the user to start chatting</Text>
//         </Box>
//       )}
//     </>
//   );
// }

// export default SingleChat








