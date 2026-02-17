import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../Context/ChatProvider";
import { Tooltip, Avatar, Box } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m) => (
                    <div style={{ display: "flex" }} key={m._id}>
                        {/* Show avatar only if it's a group chat or the other person */}
                        {(m.sender._id !== user._id) && (
                            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                <Avatar
                                    mt="7px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.profilePic}
                                />
                            </Tooltip>
                        )}
                        <span
                            style={{
                                backgroundColor: `${m.sender._id === user._id ? "#F687B3" : "#BEE3F8"
                                    }`,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                                marginLeft: m.sender._id === user._id ? "auto" : "0",
                                marginTop: "10px",
                                color: m.sender._id === user._id ? "white" : "black",
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    );
};

export default ScrollableChat;