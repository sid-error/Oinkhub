import React from "react";
import {
  Box,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Image,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import logo from "../logo/logo.png";

const MotionBox = motion(Box);

const Homepage = () => {
  return (
    <Container maxW="xl" centerContent minH="100vh" py={8}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        w="100%"
      >
        <Box
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          p={6}
          mb={4}
        >
          <Text
            fontSize={{ base: "5xl", md: "7xl" }}
            fontWeight="bold"
            color="white"
            fontFamily="'Chewy', cursive"
            letterSpacing="wide"
            textShadow="2px 2px 0px #EC4D6A"
          >
            OinkHub
          </Text>
          <Text
            color="brand.200"
            mt={1}
            mb={4}
            fontSize="lg"
            fontWeight="bold"
            letterSpacing="widest"
            fontVariant="small-caps"
          >
            oink with your piggies
          </Text>
          <Image src={logo} h="250px" objectFit="contain" alt="OinkHub Logo" />
        </Box>

        <Box
          bg="black"
          w="100%"
          p={6}
          borderRadius="2xl"
          boxShadow="0 0 20px rgba(236, 77, 106, 0.3)"
          border="1px solid"
          borderColor="brand.500"
        >
          <Tabs variant="soft-rounded" colorScheme="brand" size="lg">
            <TabList
              bg="#1a1a1a"
              p={1}
              borderRadius="xl"
              mb={6}
              border="1px solid"
              borderColor="whiteAlpha.200"
            >
              <Tab
                width="50%"
                borderRadius="lg"
                fontWeight="600"
                color="whiteAlpha.700"
                _selected={{
                  bg: "brand.500",
                  color: "white",
                  shadow: "lg",
                }}
                _hover={{ color: "white" }}
              >
                Login
              </Tab>
              <Tab
                width="50%"
                borderRadius="lg"
                fontWeight="600"
                color="whiteAlpha.700"
                _selected={{
                  bg: "brand.500",
                  color: "white",
                  shadow: "lg",
                }}
                _hover={{ color: "white" }}
              >
                Sign Up
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                <Login />
              </TabPanel>
              <TabPanel px={0}>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default Homepage;
