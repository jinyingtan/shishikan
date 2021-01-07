import {
  Flex,
  Box,
  Icon,
  Text,
  Tag,
  TagLabel,
  TagLeftIcon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
} from '@chakra-ui/react';
import { BiFlag, BiDotsHorizontalRounded } from 'react-icons/bi';
import { LockIcon, UnlockIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';

const ListCard = ({ visibility = 'public', title, id, onEditClick }) => {
  const router = useRouter();

  const routeToListPage = () => {
    router.push(`/list/${id}`);
  };

  const handleEdit = () => {
    onEditClick(id);
  }

  return (
    <Flex h="50px" direction="row">
      <Flex w="100%" _hover={{ cursor: 'pointer', backgroundColor: 'gray.100' }} onClick={routeToListPage}>
        <Flex flex="2" justify="center" align="center">
          <Icon w={6} h={6} color="gray.500" as={BiFlag} />
        </Flex>
        <Flex flex="10" justify="center" direction="column">
          <Text>{title}</Text>
          <Box>
            {visibility === 'private' ? (
              <Tag size="sm" key="sm" variant="subtle" colorScheme="red">
                <TagLeftIcon boxSize="12px" as={LockIcon} />
                <TagLabel>Private</TagLabel>
              </Tag>
            ) : (
              <Tag size="sm" key="sm" variant="subtle" colorScheme="cyan">
                <TagLeftIcon boxSize="12px" as={UnlockIcon} />
                <TagLabel>Public</TagLabel>
              </Tag>
            )}
          </Box>
        </Flex>
      </Flex>

      <Flex flex="1.5" justify="center" align="center">
        <Menu placement="bottom-end">
          <MenuButton
            as={IconButton}
            variant="ghost"
            aria-label="Search database"
            icon={<Icon w={6} h={6} color="gray.500" as={BiDotsHorizontalRounded} />}
          />
          <MenuList>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default ListCard;
