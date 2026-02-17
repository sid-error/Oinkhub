import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
    const { user } = ChatState();

    return (
        <div style={{ width: "100%" }}>
            {user && <Box>Welcome to the sty, {user.name}! 🐷</Box>}
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {/* We will put our Chat components here next */}
                <Box bg="white" w="30%" borderRadius="lg" borderWidth="1px"> My Chats </Box>
                <Box bg="white" w="68%" borderRadius="lg" borderWidth="1px"> Chat Box </Box>
            </Box>
        </div>
    );
};

export default Chatpage;