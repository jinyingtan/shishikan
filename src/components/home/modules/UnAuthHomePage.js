import React from 'react';
import { MaxWidthContainer } from '@components/containers';
import { Box, Button, Flex, Image, Heading, Stack, Text, Link } from '@chakra-ui/react';
import { useAuthModal } from '@components/auth/authModal';

const UnAuthHomePage = ({ title, subtitle, image, ctaLink, ctaText, ...rest }) => {
  const authModal = useAuthModal();

  return (
    <MaxWidthContainer>
      <Flex
        align="center"
        justify={{ base: 'center', md: 'space-around', xl: 'space-between' }}
        direction={{ base: 'column-reverse', md: 'row' }}
        wrap="no-wrap"
        minH="70vh"
        px={8}
        mb={16}
        {...rest}
      >
        <Stack spacing={4} w={{ base: '80%', md: '40%' }} align={['center', 'center', 'flex-start', 'flex-start']}>
          <Heading
            as="h1"
            size="xl"
            fontWeight="bold"
            color="primary.800"
            textAlign={['center', 'center', 'left', 'left']}
          >
            {title}
          </Heading>
          <Heading
            as="h2"
            size="md"
            color="primary.800"
            opacity="0.8"
            fontWeight="normal"
            lineHeight={1.5}
            textAlign={['center', 'center', 'left', 'left']}
          >
            {subtitle}
          </Heading>
          <Button py="4" px="4" lineHeight="1" size="md" onClick={authModal.register.onOpen}>
            Register today
          </Button>

          <Text fontSize="xs" mt={2} textAlign="center" color="primary.800" opacity="0.6">
            No credit card required.
          </Text>
        </Stack>
        <Box w={{ base: '100%', sm: '60%', md: '50%' }} mb={{ base: 12, md: 0 }}>
          <Image src={image} size="100%" rounded="1rem" shadow="2xl" />
        </Box>
      </Flex>
    </MaxWidthContainer>
  );
};

export default UnAuthHomePage;
