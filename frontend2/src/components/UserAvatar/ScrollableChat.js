import React, { useEffect } from 'react'
// import ScrollableFeed from 'react-Scrollable-Feed'
import ScrollToBottom from 'react-scroll-to-bottom';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/ChatLogics'
import { ChatState } from '../../Context/ChatProvider'
import { Avatar, Tooltip,Box } from '@chakra-ui/react'






const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();
   // console.log("Rendering ScrollableChat with messages: ", messages); // Add a log

    return (
      // <div style={{ overflow: 'auto', maxHeight: '400px'}}>
       <ScrollToBottom className="messages" scrollViewClassName="scroll-view">
        {messages && messages.map((m, i) => (
          <div style={{ display: "flex" }} key={i}>
            {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, m, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  className="avatar-border" 
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}

            <span style={{
              backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
              borderRadius: "20px",
              padding: "8px 18px", // More padding
               maxWidth: "85%",   
              marginLeft:isSameSenderMargin(messages,m,i,user._id),
              marginTop:isSameUser(messages,m,i,user._id)?3:10,
              marginRight: m.sender._id === user._id ? 10 : 0, // Space from right edge for sent

            }}>
              {m.content}
            </span>
          </div>
        ))}
      </ScrollToBottom>
    );
    
  };


  export default ScrollableChat











































// const ScrollableChat = ({ messages }) => {
//   const { user } = ChatState();

//   console.log(messages); // Debugging line

//   return (
//       <ScrollToBottom style={{ overflow: 'auto', maxHeight: '400px' }}>
//           {messages && messages.map((m, i) => {
//               console.log("Message:", m); // Debugging line
//               return (
//                   <Box display="flex" key={m._id}>
//                       {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, m, i, user._id)) && (
//                           <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
//                             <Avatar
//                               mt="7px"
//                               mr={1}
//                               size="sm"
//                               cursor="pointer"
//                               name={m.sender.name}
//                               src={m.sender.pic}
//                             />
//                           </Tooltip>
//                       )}
//                   </Box>
//               );
//           })}
//       </ScrollToBottom>
//   );
// };




// export default ScrollableChat