const asyncHandler = require('express-async-handler');
const Message = require("../models/MessageModel");
const User = require('../models/UserModel');
const Chat = require('../models/ChatModel');

exports.sendMessage = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.status(400).send("Invalid data passed into request")
    }

    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        var message = await Message.create(newMessage)
        
        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: "email name pic"
        })

        console.log("Messages", message);

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        });

        res.status(200).json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
});


exports.allMessage = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email")
            .populate("chat");
        
        res.status(200).json(messages)
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})