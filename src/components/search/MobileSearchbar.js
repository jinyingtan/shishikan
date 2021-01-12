import React from 'react';
import { Flex, Input, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useAuth } from '@components/auth';

const MobileSearchbar = ({ ...rest }) => {
  const router = useRouter();
  const auth = useAuth();

  const routeToSearchPage = () => {
    router.push('/search');
  };

  if (!auth.user) {
    return <Box></Box>;
  }

  return (
    <Flex flex="3" {...rest}>
      <Input
        placeholder="Search for lists, foods, users"
        borderColor="gray.200"
        isReadOnly
        onClick={routeToSearchPage}
      />
    </Flex>
  );
};

export default MobileSearchbar;
