import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Text,
  Button,
  useToast,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  const getSender = (loggedUser, users) => {
    if (!users || users.length < 2) return "Unknown";
    return users[0]._id === loggedUser?._id ? users[1].name : users[0].name;
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={4}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="gray.100"
      boxShadow="soft"
      h="100%"
    >
      <Flex
        pb={4}
        px={1}
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        <Text
          fontSize="xl"
          fontWeight="700"
          fontFamily="heading"
          color="gray.800"
        >
          My Chats
        </Text>
        <GroupChatModal>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="brand"
            size="sm"
            borderRadius="xl"
          >
            New Group
          </Button>
        </GroupChatModal>
      </Flex>

      <Box
        display="flex"
        flexDir="column"
        p={2}
        w="100%"
        h="100%"
        overflowY="auto"
      >
        {chats ? (
          <Stack spacing={2} overflowY="auto">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat?._id === chat._id ? "brand.500" : "gray.50"}
                color={selectedChat?._id === chat._id ? "white" : "gray.800"}
                px={4}
                py={3}
                borderRadius="xl"
                key={chat._id}
                transition="all 0.2s"
                _hover={{
                  bg:
                    selectedChat?._id === chat._id
                      ? "brand.600"
                      : "brand.50",
                  transform: "translateX(2px)",
                }}
                border="1px solid"
                borderColor={
                  selectedChat?._id === chat._id
                    ? "transparent"
                    : "gray.100"
                }
              >
                <Flex alignItems="center" gap={2} mb={1}>
                  <Text fontWeight="600" fontSize="sm" noOfLines={1}>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.isGroupChat && (
                    <Badge
                      size="sm"
                      colorScheme={selectedChat?._id === chat._id ? "whiteAlpha" : "brand"}
                      variant="subtle"
                      fontSize="10px"
                    >
                      Group
                    </Badge>
                  )}
                </Flex>
                {chat.latestMessage && (
                  <Text
                    fontSize="xs"
                    opacity={selectedChat?._id === chat._id ? 0.9 : 0.7}
                    noOfLines={2}
                  >
                    <b>{chat.latestMessage?.sender?.name ?? "Someone"}: </b>
                    {chat.latestMessage.content?.length > 40
                      ? chat.latestMessage.content.substring(0, 40) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
