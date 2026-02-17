const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/utils/db');
const userRoutes = require('./src/routes/userRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const messageRoutes = require('./src/routes/messageRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('OinkHub API is running...');
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

const PORT = process.env.PORT || 5000;

// 1. Capture the server instance
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// 2. Initialize Socket.IO
const io = require("socket.io")(server, {
    pingTimeout: 60000, // Close connection after 60s of inactivity to save bandwidth
    cors: {
        origin: "http://localhost:3000", // Your React app's URL
    },
});

// 3. Setup Connection Logic
io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    // User joins their own private room based on their ID
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.userData = userData;
        socket.emit("connected");
    });

    // User joins a specific chat room
    socket.on("join_chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    // Typing indicators
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop_typing", (room) => socket.in(room).emit("stop_typing"));

    // Real-time Message Delivery
    socket.on("new_message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;

            // Send the message to all other users in the chat room
            socket.in(user._id).emit("message_received", newMessageReceived);
        });
    });

    // Cleanup on disconnect
    socket.on("disconnect", () => {
        console.log("USER DISCONNECTED");
        socket.leave(socket.userData._id);
    });
});