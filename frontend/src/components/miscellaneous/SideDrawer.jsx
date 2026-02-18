import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import UserListItem from "../UserAvatar/UserListItem";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const navigate = useNavigate();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        px={{ base: 4, md: 6 }}
        py={3}
        borderBottom="1px solid"
        borderColor="gray.100"
        boxShadow="soft"
      >
        <Tooltip label="Search users" hasArrow placement="bottom-end">
          <Button
            variant="ghost"
            colorScheme="brand"
            onClick={() => setIsOpen(true)}
            leftIcon={<SearchIcon boxSize={5} />}
          >
            <Text display={{ base: "none", md: "flex" }} px={2}>
              Search
            </Text>
          </Button>
        </Tooltip>

        <Text
          fontSize="2xl"
          fontWeight="bold"
          fontFamily="heading"
          bgGradient="linear(to-r, brand.600, brand.400)"
          bgClip="text"
          as="span"
          display="flex"
          alignItems="center"
          gap={1}
        >
          OinkHub <Text as="span" fontSize="xl">🐷</Text>
        </Text>

        <Box display="flex" alignItems="center" gap={1}>
          <Menu>
            <MenuButton
              p={2}
              position="relative"
              borderRadius="full"
              _hover={{ bg: "gray.50" }}
            >
              {notification.length > 0 && (
                <Box
                  position="absolute"
                  top="0"
                  right="0"
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  minW="18px"
                  h="18px"
                  fontSize="11px"
                  fontWeight="bold"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {notification.length}
                </Box>
              )}
              <BellIcon fontSize="xl" />
            </MenuButton>
            <MenuList
              minW="260px"
              border="1px solid"
              borderColor="gray.100"
              shadow="elevated"
              borderRadius="xl"
              py={2}
            >
              <Box px={3} py={2} color="gray.500" fontSize="sm" fontWeight="600">
                Notifications
              </Box>
              {!notification.length && (
                <Box px={4} py={4} color="gray.400" fontSize="sm">
                  No new messages
                </Box>
              )}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                  _hover={{ bg: "brand.50" }}
                  py={3}
                >
                  <Box>
                    <Text fontSize="sm" fontWeight="500">
                      {notif.chat.isGroupChat
                        ? `New in ${notif.chat.chatName}`
                        : `From ${getSender(user, notif.chat.users)}`}
                    </Text>
                  </Box>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              bg="transparent"
              _hover={{ bg: "transparent" }}
              _active={{ bg: "transparent" }}
              p={0}
            >
              <Avatar
                size="md"
                cursor="pointer"
                name={user.name}
                src={user.profilePic || user.pic}
                border="2px solid"
                borderColor="brand.500"
              />
            </MenuButton>
            <MenuList
              minW="180px"
              border="1px solid"
              borderColor="gray.100"
              shadow="elevated"
              borderRadius="xl"
              py={2}
            >
              <ProfileModal user={user}>
                <MenuItem _hover={{ bg: "brand.50" }}>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider borderColor="gray.100" />
              <MenuItem
                onClick={logoutHandler}
                color="red.500"
                _hover={{ bg: "red.50" }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Drawer placement="left" onClose={() => setIsOpen(false)} isOpen={isOpen}>
        <DrawerOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
        <DrawerContent
          borderTopRightRadius="2xl"
          borderBottomRightRadius="2xl"
          maxW="400px"
        >
          <DrawerHeader
            borderBottomWidth="1px"
            borderColor="gray.100"
            fontFamily="heading"
            fontWeight="600"
          >
            Search users
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" gap={2} pb={4}>
              <Input
                placeholder="Name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                borderRadius="xl"
                border="2px solid"
                borderColor="gray.100"
                _focus={{ borderColor: "brand.400" }}
              />
              <Button
                colorScheme="brand"
                onClick={handleSearch}
                isLoading={loading}
                borderRadius="xl"
              >
                Go
              </Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((searchedUser) => (
                <UserListItem
                  key={searchedUser._id}
                  user={searchedUser}
                  handleFunction={() => accessChat(searchedUser._id)}
                />
              ))
            )}
            {loadingChat && (
              <Spinner
                size="md"
                color="brand.500"
                position="absolute"
                bottom={4}
                left="50%"
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
