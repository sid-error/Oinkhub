import { Box, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  const isAdmin = admin?._id === user._id;

  return (
    <Box
      px={3}
      py={1.5}
      borderRadius="xl"
      fontSize="sm"
      backgroundColor="brand.500"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
      display="flex"
      alignItems="center"
      gap={2}
      _hover={{
        bg: "brand.600",
      }}
      transition="all 0.2s"
    >
      <Text fontWeight="600" noOfLines={1}>
        {user.name}
      </Text>
      {isAdmin && (
        <Text fontSize="xs" opacity={0.9}>
          (admin)
        </Text>
      )}
      <CloseIcon boxSize={3} />
    </Box>
  );
};

export default UserBadgeItem;
