
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
   overflowY="hidden" 
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



