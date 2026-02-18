import { Avatar, Box, Text, Flex } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="gray.50"
      _hover={{
        bg: "brand.50",
        borderColor: "brand.200",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="gray.800"
      px={4}
      py={3}
      mb={2}
      borderRadius="xl"
      border="2px solid"
      borderColor="transparent"
      transition="all 0.2s"
    >
      <Avatar
        mr={3}
        size="md"
        cursor="pointer"
        name={user.name}
        src={user.profilePic}
        border="2px solid"
        borderColor="white"
        boxShadow="sm"
      />
      <Box flex={1} minW={0}>
        <Text fontWeight="600" fontSize="sm" noOfLines={1}>
          {user.name}
        </Text>
        <Text fontSize="xs" color="gray.500" noOfLines={1}>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
