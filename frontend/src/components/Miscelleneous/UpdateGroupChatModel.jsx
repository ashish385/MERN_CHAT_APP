import {  Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { FaEye } from 'react-icons/fa';
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import { endpoints } from "../../services/apis";

const { CHAT_API, USER_API } = endpoints;


const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
  } = ChatState();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameloading] = useState(false);

  const toast = useToast();
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameloading(true);
      const { data } = await axios.put(
        CHAT_API + "/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameloading(false);
      toast({
        title: "Rename Success",
        status: "success",
        duration: "5000",
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: "5000",
        isClosable: true,
        position: "top",
      });
      setRenameloading(false);
    }
    setGroupChatName("");
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    setLoading(true);
    try {
      const { data } = await axios.get(`${USER_API}?search=${search}`, config);
      console.log("search data", data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "faild to load the search result",
        isClosable: true,
        status: "error",
        duration: "5000",
        position: "bottom-left",
      });
    }
  };
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User already exist!",
        status: "error",
        duration: "5000",
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admin can add soneone!",
        status: "error",
        duration: "5000",
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.put(
        CHAT_API + "/add-to-group",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "faild to add the user in the group",
        isClosable: true,
        status: "error",
        duration: "5000",
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
  const handleRemove = async (user1) => {
    console.log("user1", user1);
    console.log("user1", selectedChat);
    console.log(
      "id",
      selectedChat.groupAdmin._id !== user._id && user1._id !== user._id
    );

    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only Admin can remove soneone!",
        status: "error",
        duration: "5000",
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.put(
        CHAT_API + "/remove-from-group",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Faild to remove the user in the group",
        isClosable: true,
        status: "error",
        duration: "5000",
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <IconButton className="flex" onClick={onOpen} icon={<FaEye />} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-4xl font-Work flex justify-center">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl className="flex m-1">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
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
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              // <ChatLoading />
              <div className="p-5 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateGroupChatModel