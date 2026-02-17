import {
    Box,
    Button,
    Dialog,
    Field,
    Input,
    VStack,
    Text,
    Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { toaster } from "../ui/toaster-utils";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const { user, chats, setChats } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return;

        try {
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch {
            toaster.create({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                type: "error",
            });
        }
    };

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toaster.create({ title: "User already added", type: "warning" });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toaster.create({ title: "Please fill all fields", type: "warning" });
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.post(
                `/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );
            setChats([data, ...chats]);
            setOpen(false);
            toaster.create({ title: "New Group Chat Created!", type: "success" });
        } catch {
            toaster.create({ title: "Failed to Create the Chat!", type: "error" });
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Header fontSize="35px" display="flex" justifyContent="center">
                    Create Group Oink 🐷
                </Dialog.Header>
                <Dialog.CloseTrigger />
                <Dialog.Body display="flex" flexDir="column" alignItems="center">
                    <VStack gap={4} w="100%">
                        <Field.Root>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </Field.Root>
                        <Field.Root>
                            <Input
                                placeholder="Add Users eg: John, Jane"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </Field.Root>

                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>

                        {loading ? (
                            <Spinner />
                        ) : (
                            searchResult
                                ?.slice(0, 4)
                                .map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                    />
                                ))
                        )}
                    </VStack>
                </Dialog.Body>
                <Dialog.Footer>
                    <Button colorScheme="pink" onClick={handleSubmit}>
                        Create Chat
                    </Button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default GroupChatModal;