const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/utils/db');
const userRoutes = require('./src/routes/userRoutes');
const chatRoutes = require("./src/routes/chatRoutes");
const messageRoutes = require("./src/routes/messageRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('OinkHub API is running...');
});

// API Routes
app.use('/api/user', userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});