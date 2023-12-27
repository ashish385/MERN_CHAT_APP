import React from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const {  selectedChat } = ChatState();
  return (
    <>
      <Box
        className={` ${
          selectedChat ? "flex" : "hidden"
        } md:flex flex-col items-center  bg-white p-3 w-full   rounded-lg border`}
      >
        <SingleChat fetchAgan={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </>
  );
};

export default ChatBox