import React from 'react';
import { Flex, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const MobileSearchbar = ({ ...rest }) => {
  const router = useRouter();

  const routeToSearchPage = () => {
    router.push('/search');
  };
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
