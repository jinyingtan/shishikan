import { Box, Flex } from '@chakra-ui/react';

export const MaxWidthContainer = (props) => {
  return (
    <Box display="flex" maxW="1280px" mx="auto" mt="40px" mb="150px" px="20px">
      {props.children}
    </Box>
  );
};
