import React from 'react';
import { Badge } from '@chakra-ui/react';

const Verdict = ({ verdict }) => {
  return (
    <Badge borderRadius="full" px="2" colorScheme="teal">
      {verdict}
    </Badge>
  );
};

export default Verdict;
