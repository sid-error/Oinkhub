import { Box, Text, IconButton, Spinner, Input, Field } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";
import ScrollableChat from "./ScrollableChat";
import { toaster } from "../ui/toaster-utils";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = () => {
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // 1. Initialize Socket Connection
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop_typing", () => setIsTyping(false));

        return () => {
            socket.disconnect();
        };
    }, [user]);

    // 2. Fetch Messages when chat changes
    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat, fetchMessages]);

    // 3. Listen for Incoming Messages (Using functional state to avoid stale closures)
    useEffect(() => {
        const messageListener = (newMessageReceived) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageReceived.chat._id
            ) {
                // Handle Notifications here if the chat isn't currently open
            } else {
                setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
            }
        };

        socket.on("message_received", messageListener);

        return () => {
            socket.off("message_received", messageListener);
        };
    }, []);

    const fetchMessages = useCallback(async () => {
        if (!selectedChat) return;

        try {
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);

            socket.emit("join_chat", selectedChat._id);
        } catch {
            toaster.create({
                title: "Error Occurred!",
                description: "Failed to Load the Messages",
                type: "error",
            });
            setLoading(false);
        }
    }, [selectedChat, user]);

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop_typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    { content: newMessage, chatId: selectedChat._id },
                    config
                );
                socket.emit("new_message", data);
                setMessages([...messages, data]);
            } catch {
                toaster.create({
                    title: "Error Occurred!",
                    description: "Failed to send the Message",
                    type: "error",
                });
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop_typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                        color="pink.500"
                        fontWeight="bold"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            variant="ghost"
                            onClick={() => setSelectedChat("")}
                        >
                            <ArrowLeft />
                        </IconButton>
                        {!selectedChat.isGroupChat ? (
                            <>{selectedChat.users[0]._id === user._id ? selectedChat.users[1].name : selectedChat.users[0].name}</>
                        ) : (
                            <>{selectedChat.chatName.toUpperCase()}</>
                        )}
                    </Text>

                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#fdf2f4" // Piggy light pink background
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" color="pink.400" />
                        ) : (
                            <div className="messages" style={{ display: "flex", flexDirection: "column", overflowY: "auto", scrollbarWidth: "none" }}>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        {isTyping ? (
                            <Text fontSize="xs" color="gray.500" fontStyle="italic" mt={1}>
                                Piggy is typing... 🐷
                            </Text>
                        ) : null}

                        <Field.Root mt={3} onKeyDown={sendMessage}>
                            <Input
                                variant="filled"
                                bg="white"
                                _focus={{ bg: "white", borderColor: "pink.300" }}
                                placeholder="Oink a message..."
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </Field.Root>
                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" color="pink.300">
                        Click on a pig to start oinking! 🐷
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;