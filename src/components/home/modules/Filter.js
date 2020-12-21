import React, { useEffect } from 'react';
import { Flex, Heading, Stack, Checkbox } from '@chakra-ui/react';

const Filter = ({ title, items, currentRefinement, refine, onRefine }) => {
  return (
    <Stack as={Flex} direction="column" mt="3">
      <Heading as="h5" size="sm">
        {title}
      </Heading>
      {items.map((item, index) => {
        return (
          <Checkbox
            value={item.value}
            isChecked={item.isRefined}
            key={item.value}
            onChange={() => {
              refine(item.value);
            }}
          >
            {item.label + ' (' + item.count + ') '}
          </Checkbox>
        );
      })}
    </Stack>
  );
};

export default Filter;
