
import React, { useState } from 'react';
import { Box, FormControl, IconButton, Input, useDisclosure } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  Spinner,
  
} from '@chakra-ui/react';
import UserListItem from '../UserAvatar/UserList';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';

const UpdatedGroupChatModal = ({ fetchAgain, setFetchAgain ,fetchMessages}) => {

  console.log("fetchmessages value:", fetchMessages);
console.log("typeof fetchmessages:", typeof fetchMessages);
  

  const { SelectedChat, setSelectedChat, user } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameloading] = useState(false);
  const toast = useToast();


  const handleAddUser=async(user1)=>{
    if(SelectedChat.users.find((u)=>u._id === user1._id)){
        toast({
          title: "User already added",
          status:"error",
          duration:5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      if(SelectedChat.groupAdmin._id !== user._id){
        toast({
          title: "Only admins can add users",
          status:"error",
          duration:5000,
          isClosable: true,
          position: "bottom",
        
        })
        return;
      }
      try {
        setLoading(true);
        const config ={
          headers:{
            Authorization: `Bearer ${user.token}`,
          },
  
        };
        const { data } = await axios.put(
  `${process.env.REACT_APP_BASE_URL}/api/chat/groupadd`,
  {
          chatId: SelectedChat._id,
          userId: user1._id,
        }, config);
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false)    
      }
  }





  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameloading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
  `${process.env.REACT_APP_BASE_URL}/api/chat/rename`,
  {
        chatId: SelectedChat._id,
        chatName: groupChatName,
      }, config);

      // Update the selected chat with the new name
      setSelectedChat({ ...SelectedChat, chatName: data.chatName });

      setFetchAgain(!fetchAgain); // Trigger re-fetch if necessary
      setRenameloading(false);
      toast({
        title: 'Chat name updated!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    } catch (error) {
      toast({
        title: 'Error Occurred!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setRenameloading(false);
    }
    setGroupChatName(''); // Clear the input field
};


  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

     const { data } = await axios.get(
  `${process.env.REACT_APP_BASE_URL}/api/user?search=${search}`,
  config
);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error Occurred!',
        description: 'Failed to load the search results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoading(false);
    }
  };
     
  //user is logged in user and user1 user is the user who is trying to remove
  const handleRemove = async (user1) => {
  // Admin cannot remove themselves
  if (user._id === user1._id && user._id === SelectedChat.groupAdmin._id) {
    toast({
      title: "Admin cannot remove themselves",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  // Only admin can remove others
  if (user._id !== user1._id && user._id !== SelectedChat.groupAdmin._id) {
    toast({
      title: "Only admins can remove other users",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  try {
    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/chat/groupremove`,
      {
        chatId: SelectedChat._id,
        userId: user1._id,
      },
      config
    );

    // Update selected chat
    // if (user1._id === user._id) {
    //   setSelectedChat(); // user left the group
    // } else {
    //   setSelectedChat(data); // admin removed another user
    // }

    // // Optional: refetch messages if still in the chat
    // if (user1._id !== user._id) {
    //   fetchmessages();
    // }

    // setFetchAgain(!fetchAgain); // refresh parent component
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    toast({
      title:
        user1._id === user._id
          ? "You left the group"
          : "User removed successfully!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  } catch (error) {
    console.error("Remove Error:", error);
    toast({
      title: "Error Occurred!",
      description:
        error.response?.data?.message || "Failed to remove the user",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  } finally {
    setLoading(false); // Always stop loading
  }
};



  return (
    <>
    <IconButton d={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />

    <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader
        fontSize="35px"
        fontFamily="Work sans"
        display="flex"
        justifyContent="center"
      >
        {SelectedChat.chatName}
      </ModalHeader>
      <ModalCloseButton />
      {/* here in box we are loadinga all users in group */}
      <ModalBody>
        <Box display="flex" flexWrap="wrap" w="100%" p={3}>
          {SelectedChat.users.map((u) => (
            <UserBadgeItem 
            key={u._id} 
            user={u} 
            handleFunction={() => handleRemove(u)} />
          ))}
        </Box>

        <FormControl>
          <Input
            placeholder="Chat Name"
            mb={3}
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <Button
            variant="solid"
            colorScheme="teal"
            ml={1}
            isLoading={renameloading}
            onClick={handleRename}
          >
            Update
          </Button>
        </FormControl>
        <FormControl>
          <Input
            placeholder="Add User to the group"
            mb={1}
            onChange={(e) => handleSearch(e.target.value)}
          />

        </FormControl>
        { loading ?(
          <Spinner size="lg" />
        ) :(
          searchResult?.map((user) => (
            <UserListItem
            key = {user._id}
            user={user}
            handleFunction={()=> handleAddUser(user)}
            />
          ))
        )}
      </ModalBody>

      <ModalFooter>
        <Button onClick={() => handleRemove(user)} colorScheme="red">
          Leave Group
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>



  </>
  )
}

export default UpdatedGroupChatModal;