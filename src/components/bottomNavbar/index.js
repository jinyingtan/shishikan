import React from 'react';
import {
  Flex,
  IconButton,
  useColorMode,
  Button,
  Box,
  Icon,
  Text,
} from '@chakra-ui/react';
import { StarIcon, AddIcon } from '@chakra-ui/icons';
import {
  MdMap,
  MdViewList,
  MdNotifications,
  MdPerson,
  MdAdd,
} from 'react-icons/md';

const BottomNavbar = () => {
  const { colorMode } = useColorMode();
  const bgColor = { light: 'white', dark: 'gray.900' };

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      flexDirection="row"
      position="fixed"
      bottom="0"
      width="100%"
      px="4"
      py="2"
      bg={bgColor[colorMode]}
      boxShadow="base"
      display={{ base: 'flex', md: 'none' }}
    >
      <Button variant="ghost" w="100%">
        <Flex direction="column" align="center">
          <Icon as={MdMap} marginBottom="1" w={6} h={6} />
          <Text fontSize="xs">Nearby</Text>
        </Flex>
      </Button>

      <Button variant="ghost" w="100%">
        <Flex direction="column" align="center">
          <Icon as={MdViewList} marginBottom="1" w={6} h={6} />
          <Text fontSize="xs">Lists</Text>
        </Flex>
      </Button>
      <Button variant="ghost" w="100%">
        <Flex direction="column" align="center">
          <Icon as={MdAdd} marginBottom="1" w={6} h={6} />
          <Text fontSize="xs">Add</Text>
        </Flex>
      </Button>
      <Button variant="ghost" w="100%">
        <Flex direction="column" align="center">
          <Icon as={MdNotifications} marginBottom="1" w={6} h={6} />
          <Text fontSize="xs">Activities</Text>
        </Flex>
      </Button>
      <Button variant="ghost" w="100%">
        <Flex direction="column" align="center">
          <Icon as={MdPerson} marginBottom="1" w={6} h={6} />
          <Text fontSize="xs">Me</Text>
        </Flex>
      </Button>
    </Flex>
  );
};

export default BottomNavbar;
