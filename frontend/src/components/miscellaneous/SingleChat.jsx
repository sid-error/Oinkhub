import {
  Box,
  Text,
  IconButton,
  Spinner,
  Input,
  FormControl,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";

import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import { getSender, getSenderFull } from "../../config/ChatLogics";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();
  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatState();

  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join_chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }, [selectedChat, user.token, toast]);

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

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat, fetchMessages]);

  useEffect(() => {
    const handleMessageReceived = (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        setNotification((prev) => {
          if (prev.some((n) => n._id === newMessageReceived._id)) return prev;
          return [newMessageReceived, ...prev];
        });
        setFetchAgain((f) => !f);
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    };
    socket.on("message_received", handleMessageReceived);
    return () => socket.off("message_received", handleMessageReceived);
  }, []);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      const contentToSend = newMessage.trim();
      if (!contentToSend) return;
      socket.emit("stop_typing", selectedChat._id);
      setNewMessage("");
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/message",
          { content: contentToSend, chatId: selectedChat._id },
          config
        );
        socket.emit("new_message", data);
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
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
          <Flex
            fontSize={{ base: "lg", md: "xl" }}
            pb={4}
            px={2}
            w="100%"
            justifyContent="space-between"
            alignItems="center"
            fontFamily="heading"
            fontWeight="600"
            color="gray.800"
            borderBottom="1px solid"
            borderColor="gray.100"
          >
            <Flex alignItems="center" gap={2}>
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat(null)}
                size="sm"
                variant="ghost"
                colorScheme="brand"
                borderRadius="full"
              />
              {!selectedChat.isGroupChat ? (
                <>
                  <Text>{getSender(user, selectedChat.users)}</Text>
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  <Text>{selectedChat.chatName}</Text>
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              )}
            </Flex>
          </Flex>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={4}
            bg="gray.50"
            w="100%"
            h="100%"
            borderRadius="xl"
            overflowY="hidden"
            border="1px solid"
            borderColor="gray.100"
          >
            {loading ? (
              <Flex justify="center" align="center" h="100%">
                <Spinner
                  size="xl"
                  color="brand.500"
                  thickness="3px"
                  emptyColor="gray.200"
                />
              </Flex>
            ) : (
              <div
                className="messages"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                  scrollbarWidth: "thin",
                  flex: 1,
                  minHeight: 0,
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} mt={4}>
              {isTyping && (
                <Text
                  fontSize="xs"
                  color="brand.500"
                  fontStyle="italic"
                  mb={2}
                >
                  Someone is typing...
                </Text>
              )}
              <Input
                variant="filled"
                bg="white"
                placeholder="Type a message..."
                onChange={typingHandler}
                value={newMessage}
                borderRadius="xl"
                border="2px solid"
                borderColor="gray.100"
                _hover={{ borderColor: "brand.200" }}
                _focus={{ borderColor: "brand.400", bg: "white" }}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Flex
          align="center"
          justify="center"
          h="100%"
          flexDir="column"
          gap={4}
        >
          <Text fontSize="4xl" opacity={0.5}>
            🐷
          </Text>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            color="gray.500"
            textAlign="center"
            fontFamily="heading"
          >
            Select a chat to start oinking
          </Text>
        </Flex>
      )}
    </>
  );
};

export default SingleChat;
