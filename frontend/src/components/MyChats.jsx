import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { IoAdd } from "react-icons/io5";
import ChatLoading from './Miscelleneous/ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './Miscelleneous/GroupChatModal';
import { endpoints } from "../services/apis";

const { USER_API, CHAT_API, MESSAGE_API } = endpoints;


const MyChats = ({ fetchAgain, setFetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
  // console.log("user ka token",user.token);
  const getConfig = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const toast = useToast();

  const fetchChats = async () => {
    console.log("fetchChats function");
    try {
      const { data } = await axios.get(CHAT_API, getConfig);
      console.log("get my chat data", data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Chat Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(user);
    fetchChats();
  }, [fetchAgain,loggedUser]);
  return (
    <>
      <Box
        // d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        className={` ${
          selectedChat ? "hidden" : "flex"
        } md:flex  flex-col items-center bg-white p-3 w-full md:w-[31%] rounded-lg border`}
      >
        <Box
          className="pb-3 px-3 text-2xl md:text-3xl w-full font-light flex justify-between items-center "
          fontFamily={"work serif"}
        >
          My Chats
          <GroupChatModal>
            <Button
              className="flex text-[17px] md:text-[10px] lg:text-[17px] "
              fontFamily={"work serif"}
              rightIcon={<IoAdd />}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>

        <Box className="flex flex-col p-3 bg-[#F8F8F8] w-full h-full rounded-lg overflow-y-hidden">
          {chats ? (
            <Stack overflowY={"scroll"}>
              {chats.map((chat, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedChat(chat)}
                  className={`${
                    selectedChat === chat
                      ? "bg-[#E8E8E8] text-white "
                      : "bg-[#38B2AC] text-black"
                  } px-3 py-2 rounded-lg `}
                >
                  <Text className="cursor-pointer">
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  <Text></Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats