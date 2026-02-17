import { Box, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor="pink.500" // Matches OinkHub branding
      color="white"
      cursor="pointer"
      onClick={handleFunction}
      display="flex"
      alignItems="center"
    >
      <Text fontSize="sm" fontWeight="bold">
        {user.name}
      </Text>
      {/* Show admin tag if the user is the group creator */}
      {admin === user._id && <span style={{ paddingLeft: "4px" }}>(Admin)</span>}
      
      <CloseIcon pl={1} ml={1} w={3} h={3} />
    </Box>
  );
};

export default UserBadgeItem;