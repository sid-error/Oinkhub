import React, { useState } from "react";
import {
  Button,
  Input,
  VStack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { "Content-Type": "application/json" } };

      const response = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      const userData = response.data;
      localStorage.setItem("userInfo", JSON.stringify(userData));

      toast({
        title: "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error!",
        description: error?.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      setLoading(false);
    }
  };

  return (
    <VStack spacing={5}>
      <FormControl>
        <FormLabel fontWeight="600" color="whiteAlpha.900">
          Email
        </FormLabel>
        <Input
          value={email}
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
        <InputGroup size="lg">
          <Input
            value={password}
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            bg="whiteAlpha.100"
            border="2px solid"
            borderColor="transparent"
            _hover={{ borderColor: "brand.500", bg: "whiteAlpha.200" }}
            _focus={{ borderColor: "brand.500", bg: "whiteAlpha.200" }}
            color="white"
          />
          <InputRightElement width="4.5rem" h="100%">
            <Button
              h="2rem"
              size="sm"
              variant="ghost"
              onClick={() => setShow(!show)}
              color="whiteAlpha.700"
              _hover={{ bg: "whiteAlpha.100", color: "white" }}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        bg="brand.500"
        color="white"
        _hover={{ bg: "brand.600" }}
        width="100%"
        size="lg"
        onClick={submitHandler}
        isLoading={loading}
        loadingText="Signing in..."
        mt={2}
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
