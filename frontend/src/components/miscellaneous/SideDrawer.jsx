import React, { useState } from "react";
import {
    Box, Button, Tooltip, Text, Menu, MenuButton, MenuList,
    Avatar, MenuItem, MenuDivider, Drawer, DrawerOverlay,
    DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner
} from "@chakra-ui/react";
import { SearchIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons"; // You might need to install @chakra-ui/icons
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // Manual drawer state

    const { user } = ChatState();
    const navigate = useNavigate();
    const toast = useToast();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    const handleSearch = async () => {
        if (!search) {
            toast({ title: "Please enter something in search", status: "warning", duration: 3000, isClosable: true, position: "top-left" });
            return;
        }

        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);

        } catch {
            toast({ title: "Error Occured!", description: "Failed to Load the Search Results", status: "error", duration: 5000, isClosable: true, position: "bottom-left" });
        }
    };

    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" bg="white" w="100%" p="5px 10px 5px 10px" borderWidth="5px" borderColor="pink.100">
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={() => setIsOpen(true)}>
                        <i className="fas fa-search"></i>
                        <Text display={{ base: "none", md: "flex" }} px={4}>Search User</Text>
                    </Button>
                </Tooltip>

                <Text fontSize="2xl" fontWeight="bold" color="pink.500">OinkHub 🐷</Text>

                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        {/* Notification list will go here later */}
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.profilePic} />
                        </MenuButton>
                        <MenuList>
                            <MenuItem>My Profile</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement="left" onClose={() => setIsOpen(false)} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Pigs</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input placeholder="Search by name or email" mr={2} value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button onClick={handleSearch} isLoading={loading}>Go</Button>
                        </Box>
                        {/* Search results will be mapped here */}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default SideDrawer;