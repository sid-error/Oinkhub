import { Box, Stack, Text, Button } from "@chakra-ui/react";
import { useEffect, useCallback } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { Plus } from "lucide-react";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

    const fetchChats = useCallback(async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get("/api/chat", config);
            setChats(data);
        } catch (error) {
            console.error("Failed to load chats", error);
        }
    }, [user, setChats]);

    useEffect(() => {
        fetchChats();
    }, [fetchAgain, fetchChats]); // Re-fetch if a chat is deleted/added

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModal>
                    <Button display="flex" fontSize={{ base: "17px", md: "10px", lg: "17px" }}>
                        New Group <Plus size={20} />
                    </Button>
                </GroupChatModal>
            </Box>

            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat) => (
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor="pointer"
                                bg={selectedChat === chat ? "#F687B3" : "#E8E8E8"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat
                                        ? chat.users[0]._id === user._id ? chat.users[1].name : chat.users[0].name
                                        : chat.chatName}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <Text>Loading...</Text>
                )}
            </Box>
        </Box>
    );
};

export default MyChats;