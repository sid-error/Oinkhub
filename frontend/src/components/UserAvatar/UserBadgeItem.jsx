import { Box } from "@chakra-ui/react";
import { X } from "lucide-react";

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            backgroundColor="pink.500"
            color="white"
            cursor="pointer"
            onClick={handleFunction}
            display="flex"
            alignItems="center"
        >
            {user.name}
            <X size={14} style={{ marginLeft: "4px" }} />
        </Box>
    );
};

export default UserBadgeItem;