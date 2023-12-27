import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { IoIosNotifications, IoIosSearch } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa";
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { ChatState } from '../../context/ChatProvider';
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { endpoints } from "../../services/apis";
import { getSender } from '../../config/ChatLogics';
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const { CHAT_API, USER_API } = endpoints;

const SideDrawer = () => {

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  

  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  

  const {
    user,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatState();
  const getConfig = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const postConfig = {
    headers: {
      "Content-type": "Application/json",
      Authorization: `Bearer ${user.token}`,
    },
  };


   const logoutHandler = () => {
     localStorage.removeItem("userInfo");
     navigate("/");
  };
  
  const handleSearch = async () => {
    console.log("handleSearch function");
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    setLoading(true);
     try {
      

       const { data } = await axios.get(USER_API + `?search=${search}`, getConfig);
       console.log("get search data",data);
       
      //  if (!chats.find((c) => c._id === data._id)) {
      //    setChats([data, ...chats])
      //   }; 
        
        setSearchResult(data);
        setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }

  }

  const accessChat = async (userId) => {
    console.log("Access chat function");
    setLoadingChat(true);
    try {
      
      const { data } = await axios.post(CHAT_API, { userId }, postConfig);

    setSelectedChat(data);
    setLoadingChat(false);
    onClose();

    } catch (error) {
      toast({
        title: "Error fetching the chat!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setLoadingChat(false);
  }
  return (
    <>
      <Box className="flex justify-between items-center bg-white w-full py-1 px-3 border-[5px]">
        <Tooltip label="Search users to chat" hasArrow>
          <Button
            variant="ghost"
            className="flex justify-between  "
            onClick={onOpen}
          >
            <IoIosSearch className="text-lg" />
            <Text className="hidden md:flex p-1 text-lg">Search User</Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily={"sans work"}>
          Chat-App
        </Text>

        <div className="flex">
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <IoIosNotifications className="text-3xl" />
            </MenuButton>
            <MenuList className="px-3">
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<FaAngleDown />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
            <DrawerBody>
              <Box className="flex w-full">
                <Input
                  placeholder="Search by name or email"
                  mr={2}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
              </Box>
              {loading ? (
                <ChatLoading />
              ) : (
                <>
                  {searchResult.map((user, index) => (
                    <UserListItem
                      key={index}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))}
                </>
              )}
              {loadingChat && <Spinner ml="auto" d="flex" />}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
}

export default SideDrawer