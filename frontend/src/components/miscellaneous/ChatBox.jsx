import { Box } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={4}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="gray.100"
      boxShadow="soft"
      h="100%"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
