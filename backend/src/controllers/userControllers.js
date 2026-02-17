const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/user
const registerUser = async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please enter all the fields" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
        name,
        email,
        password,
        profilePic: pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: "Failed to create the user" });
    }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/user/login
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // matchPassword is the method we created in our User Model
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: "Invalid Email or Password" });
    }
};

// @desc    Get or Search all users
// @route   GET /api/user?search=porky
// @access  Public (But we will protect it in the routes)
const allUsers = async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    // Find users except the one currently logged in
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
};

// Export
module.exports = { registerUser, authUser, allUsers };