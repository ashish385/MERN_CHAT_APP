const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const generateToken = require('../config/generateToken');

// signup
 exports.registerUser = asyncHandler(async (req,res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password ) {
        res.status(400);
        throw new Error('Please Enter all the fields')
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
        res.status(400);
        throw new Error("User already exist");
    }

    const user = await User.create({
        name, email, password, pic
    });
     
     const hashPassword = await user

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token:generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error("Faild to create the user");
    }
 })

//  /api/login
exports.authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

      if ( !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the fields");
    }
    
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token:generateToken(user._id)
        })
    }else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
})
 
// /api/user?search=Ashish
exports.allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
        ]
    } : {};

    // get all user expect current user
    const users = await User.find(keyword).find({ _id: { $ne: req.user.id } });
    // const users = await User.find(keyword);
    if (users.length === 0) {
        return res.json({
            message: "User not found!",
            users
        })
    }
    res.send(users);
})