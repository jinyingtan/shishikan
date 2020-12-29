import React from 'react';
import { Flex, IconButton, useColorMode, Button, Box, Icon, Text } from '@chakra-ui/react';

const FoodDetailBottomNavbar = () => {
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
      bg="white"
      boxShadow="base"
      display={{ base: 'flex', md: 'none' }}
      pb="calc(.5rem + env(safe-area-inset-bottom))"
    >
      <Button w="100%">Review</Button>
    </Flex>
  );
};

export default FoodDetailBottomNavbar;
