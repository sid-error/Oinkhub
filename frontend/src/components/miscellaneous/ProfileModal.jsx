import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  IconButton,
  Text,
  Image,
  useDisclosure,
  Box,
  Input,
  VStack,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileModal = ({ user, children, setUser }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(user.name);
  const [pic, setPic] = useState(user.pic || user.profilePic);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setName(user.name);
    setPic(user.pic || user.profilePic);
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPic(reader.result);
      };
      reader.readAsDataURL(file);
      // TODO: Implement actual upload logic here (e.g. to Cloudinary)
      // For now we just set the preview as the pic
    }
  };

  const handleRemoveImage = () => {
    setPic("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Assuming there is an endpoint to update profile
      // If not, this might need adjustment
      const { data } = await axios.put(
        "/api/user/profile",
        { name, pic },
        config
      );

      toast({
        title: "Profile Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      // Update local storage and context if valid response
      if (data) {
        localStorage.setItem("userInfo", JSON.stringify(data));
        // If we had access to setUser from context, we would call it here
        // window.location.reload(); // Simple reload to reflect changes
      }
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Updating Profile",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
        <ModalContent
          h="auto"
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="xl"
          bg="brand.500"
          color="white"
        >
          <ModalHeader
            fontSize="2xl"
            fontFamily="heading"
            fontWeight="600"
            textAlign="center"
          >
            My Profile
          </ModalHeader>
          <ModalCloseButton color="white" />

          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            pb={8}
          >
            <VStack spacing={6} w="100%">
              <Box position="relative" textAlign="center">
                <Image
                  borderRadius="full"
                  boxSize="150px"
                  src={pic}
                  alt={name}
                  border="4px solid"
                  borderColor="white"
                  objectFit="cover"
                  fallbackSrc="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                />
                <Box mt={4} display="flex" gap={2} justifyContent="center">
                  <Button
                    as="label"
                    htmlFor="profile-upload"
                    cursor="pointer"
                    size="sm"
                    bg="white"
                    color="brand.600"
                    _hover={{ bg: "gray.100" }}
                    borderRadius="lg"
                    fontSize="xs"
                  >
                    Upload New
                    <input
                      type="file"
                      id="profile-upload"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="white"
                    color="white"
                    _hover={{ bg: "whiteAlpha.200" }}
                    borderRadius="lg"
                    fontSize="xs"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>

              <FormControl w="80%">
                <FormLabel fontWeight="600" fontSize="sm">Username</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  bg="whiteAlpha.200"
                  border="transparent"
                  _focus={{ bg: "whiteAlpha.300", borderColor: "white" }}
                  _placeholder={{ color: "whiteAlpha.700" }}
                />
              </FormControl>

              <FormControl w="80%">
                <FormLabel fontWeight="600" fontSize="sm">Email (Read-only)</FormLabel>
                <Input
                  value={user.email}
                  isReadOnly
                  bg="blackAlpha.200"
                  border="transparent"
                  cursor="not-allowed"
                  opacity={0.8}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter justifyContent="center" pb={6}>
            <Button
              onClick={handleSave}
              bg="white"
              color="brand.500"
              _hover={{ bg: "gray.100" }}
              borderRadius="xl"
              px={8}
              isLoading={loading}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
