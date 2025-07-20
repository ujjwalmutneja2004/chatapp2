
import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SingleChat  from './SingleChat';

function ChatBox({fetchAgain,setFetchAgain}) {
  const { SelectedChat } =ChatState();
  // console.log("Selectedchat"+SelectedChat); 
  return (
    
    
    <Box 
    display={{ base: SelectedChat && SelectedChat._id ? "flex" : "none",md:"flex"}}
     position={{ base: "absolute", md: "static" }} // Absolute on mobile, static on desktop
  top={0}
  left={0}
  w={{ base: "100%", md: "69%" }} // Full width on mobile, 69% on desktop
   h={{ base: "100vh", md: "100%" }} 
  //h="100%"
  zIndex={10} // Make sure it appears above MyChats
  // ...other props
   bg="white"
  borderRadius="lg"
  borderWidth="1px"
  flexDir="column"
  p={3}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/></Box>
  );
}

export default ChatBox





