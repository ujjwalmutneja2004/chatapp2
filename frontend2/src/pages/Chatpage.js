// import React, { useState, useEffect } from 'react';
//  import axios from 'axios';

// const Chatpage = () => {
//     //use state to store data in any state
//     //initial state will be an empty array
//     const [chats, setChats] = useState([]);
//     const [error, setError] = useState(null);

//     const fetchChats = async () => {
//         try {
          

//             const token = localStorage.getItem('authToken');
//             // Check if token exists
//             if (!token) {
//                 throw new Error('No token found. Please log in.');
//             }
//             const { data } = await axios.get('http://localhost:5000/api/chat',{
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             });
//             setChats(data);  
//             console.log(data);
//         } catch (err) {
//             console.error("Error fetching chats:", err.response ? err.response.data : err.message);
//               setError(err.response ? err.response.data.message : err.message);
//             // console.error("Error fetching chats:", err);
//             // setError(err.message);
        
//      }
//     };

//     //useffect means when ever components is  function  is called
//     useEffect(() => {
//         fetchChats();
//     }, []);
    
//     return (
//         <div>
//             {error && <p>Error: {error}</p>}
//             {chats && chats.map((chat) => (
//                 <div key={chat._id}>{chat.chatName}</div>
//             ))}
//         </div>
//     );
// };

// export default Chatpage;






/////////////////////maincode
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from "../components/miscellenous/SideDrawer"
import MyChats from "../components/UserAvatar/MyChats"
import ChatBox from "../components/UserAvatar/ChatBox"
import ChatBot from "../components/UserAvatar/Bot";

const Chatpage = () => {
   const { user }=ChatState();
   //const {fetchAgain,setFetchAgain}=useState(false);
   const [fetchAgain, setFetchAgain] = useState(false);

    
   return <div style={{width:"100%"}}>
    {user && <SideDrawer/>}
    <Box
  position="relative"
  display="flex"
  flexDirection={{ base: "column", md: "row" }}
  width="100%"
  height="100vh" // or your preferred height
  ml={0}
  pb="5px"
>
      {user && (
         <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />)}
      {user && (
         <ChatBox  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>)}
    </Box>

    <Box>
        <ChatBot />
      </Box>
   </div>;
};

export default Chatpage;



