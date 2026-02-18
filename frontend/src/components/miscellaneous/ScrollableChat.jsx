import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../Context/ChatProvider";
import { Tooltip, Avatar, Box } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <Box display="flex" key={m._id} py={0.5}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                label={m.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={2}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.profilePic}
                  border="2px solid"
                  borderColor="white"
                  boxShadow="sm"
                />
              </Tooltip>
            )}
            <Box
              maxW="75%"
              px={4}
              py={2}
              borderRadius="2xl"
              ml={isSameSenderMargin(messages, m, i, user._id)}
              mt={isSameUser(messages, m, i, user._id) ? 1 : 2}
              bg={m.sender._id === user._id ? "brand.500" : "gray.200"}
              color={m.sender._id === user._id ? "white" : "gray.800"}
              boxShadow="sm"
            >
              <Box fontSize="sm">{m.content}</Box>
            </Box>
          </Box>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
