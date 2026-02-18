import { Stack, Skeleton, Flex } from "@chakra-ui/react";

const ChatLoading = () => {
  return (
    <Stack spacing={3} w="100%">
      {[...Array(8)].map((_, i) => (
        <Flex key={i} align="center" gap={3} p={2}>
          <Skeleton
            height="40px"
            width="40px"
            borderRadius="full"
            flexShrink={0}
          />
          <Skeleton height="16px" flex={1} borderRadius="md" />
        </Flex>
      ))}
    </Stack>
  );
};

export default ChatLoading;
