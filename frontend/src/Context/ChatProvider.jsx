import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const userInfo = localStorage.getItem("userInfo");
        return userInfo ? JSON.parse(userInfo) : null;
    });

    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);

    // ✅ IMPORTANT: add these
    const [notification, setNotification] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate("/");
    }, [navigate, user]);

    return (
        <ChatContext.Provider
            value={{
                user,
                setUser,
                selectedChat,
                setSelectedChat,
                chats,
                setChats,
                notification,
                setNotification,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => useContext(ChatContext);

export default ChatProvider;
