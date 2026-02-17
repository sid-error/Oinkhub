import { Button, FormControl, FormLabel, Input, VStack, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password) {
            toast({ title: "Please Fill all the Fields", status: "warning", duration: 5000, isClosable: true, position: "bottom" });
            setLoading(false);
            return;
        }

        try {
            const config = { headers: { "Content-type": "application/json" } };
            const { data } = await axios.post("/api/user", { name, email, password, pic }, config);
            toast({ title: "Registration Successful", status: "success", duration: 5000, isClosable: true, position: "bottom" });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats");
        } catch (error) {
            toast({ title: "Error Occurred!", description: error.response.data.message, status: "error", duration: 5000, isClosable: true, position: "bottom" });
            setLoading(false);
        }
    };

    return (
        <VStack spacing="5px">
            <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter Your Name" onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" placeholder="Enter Your Password" onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Button colorScheme="pink" width="100%" style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>
                Sign Up
            </Button>
        </VStack>
    );
};

export default Signup;