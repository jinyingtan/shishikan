import { Flex, Box, Icon, Text, Tag, TagLabel, TagLeftIcon, IconButton } from '@chakra-ui/react';
import { BiFlag, BiDotsHorizontalRounded } from 'react-icons/bi';
import { LockIcon, UnlockIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';

const ListCard = ({ visibility = 'public', title, id }) => {
  const router = useRouter();

  const routeToListPage = () => {
    router.push(`/list/${id}`);
  };
  return (
    <Flex
      h="50px"
      direction="row"
      _hover={{ cursor: 'pointer', backgroundColor: 'gray.100' }}
      onClick={routeToListPage}
    >
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
      <Flex flex="1.5" justify="center" align="center">
        <IconButton
          variant="ghost"
          aria-label="Search database"
          icon={<Icon w={6} h={6} color="gray.500" as={BiDotsHorizontalRounded} />}
        />
      </Flex>
    </Flex>
  );
};

export default ListCard;
