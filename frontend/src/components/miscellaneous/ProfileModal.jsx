import {
  Dialog,
  IconButton,
  Image,
  Text,
  Button,
} from "@chakra-ui/react";
import { Eye } from "lucide-react";

const ProfileModal = ({ user, children }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {children ? (
          children
        ) : (
          <IconButton display={{ base: "flex" }} variant="ghost">
            <Eye />
          </IconButton>
        )}
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          fontSize="40px"
          display="flex"
          justifyContent="center"
          fontWeight="bold"
          color="pink.500"
        >
          {user.name}
        </Dialog.Header>
        <Dialog.CloseTrigger />
        <Dialog.Body
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="space-between"
          gap={4}
        >
          <Image
            borderRadius="full"
            boxSize="150px"
            src={user.profilePic}
            alt={user.name}
            border="4px solid"
            borderColor="pink.100"
          />
          <Text fontSize={{ base: "28px", md: "30px" }}>
            Email: {user.email}
          </Text>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.ActionTrigger asChild>
            <Button variant="outline">Close</Button>
          </Dialog.ActionTrigger>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProfileModal;