import {
  Box,
  Button,
  Input,
  VStack,
  Spinner,
  Flex,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);

      setSearchResult(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast({
        title: "Error Occurred!",
        description: "Failed to load search results",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length < 2) {
      toast({
        title: "Please fill all fields",
        description: "Group name and at least 2 users are required",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      setIsOpen(false);

      toast({
        title: "Group created!",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      toast({
        title: "Failed to create group",
        description: err?.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setGroupChatName("");
    setSelectedUsers([]);
    setSearch("");
    setSearchResult([]);
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)} style={{ display: "inline-block" }}>
        {children}
      </span>

      <Modal isOpen={isOpen} onClose={handleClose} isCentered size="lg">
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" overflow="hidden" boxShadow="elevated">
          <ModalHeader
            textAlign="center"
            fontFamily="heading"
            fontWeight="600"
            py={6}
          >
            Create group chat
          </ModalHeader>

          <ModalCloseButton top={4} right={4} />

          <ModalBody pb={6}>
            <VStack spacing={5} align="stretch">
              <Box>
                <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                  Group name
                </Text>
                <Input
                  placeholder="e.g. Weekend squad"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="gray.100"
                  _focus={{ borderColor: "brand.400" }}
                />
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="600" mb={2} color="gray.700">
                  Add members
                </Text>
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="gray.100"
                  _focus={{ borderColor: "brand.400" }}
                />
              </Box>

              {selectedUsers.length > 0 && (
                <Box w="100%">
                  <Text fontSize="xs" fontWeight="600" mb={2} color="gray.500">
                    Selected ({selectedUsers.length})
                  </Text>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    {selectedUsers.map((u) => (
                      <UserBadgeItem
                        key={u._id}
                        user={u}
                        handleFunction={() => handleDelete(u)}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {loading ? (
                <Flex justify="center" py={4}>
                  <Spinner color="brand.500" />
                </Flex>
              ) : (
                searchResult?.slice(0, 4).map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleGroup(u)}
                  />
                ))
              )}
            </VStack>
          </ModalBody>

          <ModalFooter borderTop="1px solid" borderColor="gray.100">
            <Button
              colorScheme="brand"
              onClick={handleSubmit}
              borderRadius="xl"
            >
              Create group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
