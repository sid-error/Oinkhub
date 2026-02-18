import React, { useState } from "react";
import {
  Button,
  Input,
  VStack,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );

      toast({
        title: "Account created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: error?.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing={5}>
      <FormControl>
        <FormLabel fontWeight="600" color="whiteAlpha.900">
          Name
        </FormLabel>
        <Input
          placeholder="Your name"
          onChange={(e) => setName(e.target.value)}
          size="lg"
          bg="whiteAlpha.100"
          border="2px solid"
          borderColor="transparent"
          _hover={{ borderColor: "brand.500", bg: "whiteAlpha.200" }}
          _focus={{ borderColor: "brand.500", bg: "whiteAlpha.200" }}
          color="white"
        />
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="600" color="whiteAlpha.900">
          Email
        </FormLabel>
        <Input
          type="email"
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
          size="lg"
          bg="whiteAlpha.100"
          border="2px solid"
          borderColor="transparent"
          _hover={{ borderColor: "brand.500", bg: "whiteAlpha.200" }}
          _focus={{ borderColor: "brand.500", bg: "whiteAlpha.200" }}
          color="white"
        />
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="600" color="whiteAlpha.900">
          Password
        </FormLabel>
        <Input
          type="password"
          placeholder="Create a password"
          onChange={(e) => setPassword(e.target.value)}
          size="lg"
          bg="whiteAlpha.100"
          border="2px solid"
          borderColor="transparent"
          _hover={{ borderColor: "brand.500", bg: "whiteAlpha.200" }}
          _focus={{ borderColor: "brand.500", bg: "whiteAlpha.200" }}
          color="white"
        />
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="600" color="whiteAlpha.900">
          Confirm Password
        </FormLabel>
        <Input
          type="password"
          placeholder="Confirm your password"
          onChange={(e) => setConfirmpassword(e.target.value)}
          size="lg"
          bg="whiteAlpha.100"
          border="2px solid"
          borderColor="transparent"
          _hover={{ borderColor: "brand.500", bg: "whiteAlpha.200" }}
          _focus={{ borderColor: "brand.500", bg: "whiteAlpha.200" }}
          color="white"
        />
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="600" color="whiteAlpha.900">
          Profile Picture
        </FormLabel>
        <Input
          type="file"
          p={2}
          accept="image/*"
          onChange={(e) => setPic(e.target.files[0])}
          size="lg"
          bg="whiteAlpha.100"
          border="2px dashed"
          borderColor="whiteAlpha.300"
          _hover={{ borderColor: "brand.500" }}
          color="white"
        />
      </FormControl>

      <Button
        bg="brand.500"
        color="white"
        _hover={{ bg: "brand.600" }}
        width="100%"
        size="lg"
        mt={2}
        onClick={submitHandler}
        isLoading={loading}
        loadingText="Creating account..."
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
