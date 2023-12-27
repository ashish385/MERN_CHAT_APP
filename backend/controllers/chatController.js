const asynchandler = require('express-async-handler');
const Chat = require("../models/ChatModel");
const User = require('../models/UserModel');

// create chata one to one or access
exports.accessChat = asynchandler(async (req, res) => {
    const { userId } = req.body;
    // const userId = "657e88cbd12e0c6498a41131";
    console.log(req.body);

    if (!userId) {
        console.log("userId params not sent with request");
        return res.status(401).json({
            message:"user id not found"
        })
    }

    console.log("before isChat",req.user._id);
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
    
    console.log("mid in isChat");
    
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select:"name email pic"
    });

    console.log("after isChat");

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users:[req.user._id,userId]
        }

        try {
            const createChat = await Chat.create(chatData);

            const fullChat = await Chat.findOne({
              _id: createChat._id,
            }).populate("users", "-password");

            res.status(200).json({
                fullChat
            })
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
})

// fetch all chats
exports.fetchChats = asynchandler(async (req, res) => {
    try {
        const allChats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } },
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).send(results);
            });
        
    } catch (error) {
        console.log(error);
        res.status(400)
        throw new Error(error.message)
    }
});


// create group chat
exports.createGroupChat = asynchandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all fields! " });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).send("More than 2 usres are required to from a group chat!");
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        
        res.status(200).send(fullGroupChat);
    } catch (error) {
        console.log(error.message);
        res.status(400);
        throw new Error(error.message)
    }
});


// rename Group Name
exports.renameGroup = asynchandler(async (req, res) => {
    console.log("rename group name", req.body);
    const { chatId, chatName } = req.body;

    const updateChat = await Chat.findByIdAndUpdate({ _id:chatId }, { chatName }, { new: true })
        .populate("users", "-password")
        .populate('groupAdmin', "-password");
    if (!updateChat) {
        res.status(404)
        throw new Error("Chat not found!")
    } else {
        res.status(200).send(updateChat);
    }
})

// add to group
exports.addToGroup = asynchandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const addUser = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    
    if (!addUser) {
        res.status(404);
        throw new Error("Chat not found!");
    } else {
        res.status(200).send(addUser);
    }
});

exports.removeFromGroup = asynchandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const removeUser = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
        .populate("groupAdmin", "-password");
    
    if (!removeUser) {
        res.status(400).send('chat not found');
        throw new Error("Chat Not Found")
    } else {
        res.status(200).send(removeUser);
    }
})