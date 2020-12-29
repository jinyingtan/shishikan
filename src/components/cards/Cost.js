import React from 'react';
import { Badge } from '@chakra-ui/react';

const Cost = ({ cost }) => {
  let value = '';
  if (cost === '1') {
    value = '$';
  } else if (cost === '2') {
    value = '$$';
  } else {
    value = '$$$';
  }

  return (
    <Badge borderRadius="full" px="2" mr="2">
      {value}
    </Badge>
  );
};

export default Cost;
