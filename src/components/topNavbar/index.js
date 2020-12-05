import React from 'react';
import { Flex, IconButton, useColorMode, Icon, Input, Button, HStack } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { MdMenu } from 'react-icons/md';

const TopNavbar = () => {
  const { colorMode } = useColorMode();
  const bgColor = { light: 'white', dark: 'gray.900' };

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      flexDirection="row"
      position="sticky"
      top="0"
      width="100%"
      px="2"
      py="2"
      bg={bgColor[colorMode]}
      boxShadow="base"
      zIndex="100"
    >
      <IconButton variant="ghost" aria-label="Search" icon={<StarIcon />} />

      <Input flex="3" placeholder="Search for lists, foods, users" borderColor="gray.200" />

      <IconButton
        variant="ghost"
        aria-label="Menu"
        icon={<Icon as={MdMenu} marginBottom="1" w={6} h={6} />}
        display={{ base: 'flex', md: 'none' }}
      />

      <HStack display={{ base: 'none', md: 'flex' }}>
        <Button variant="ghost">Login</Button>
        <Button colorScheme="green">Join free</Button>
      </HStack>
    </Flex>
  );
};

export default TopNavbar;
