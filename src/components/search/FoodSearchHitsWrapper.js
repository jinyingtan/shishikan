import React from 'react';
import { Icon, HStack, Text, ListItem } from '@chakra-ui/react';
import { FiTriangle } from 'react-icons/fi';
import { useRouter } from 'next/router';

const FoodSearchHitWrapper = ({ hits }) => {
  const router = useRouter();

  const routeToFood = (foodId) => {
    router.push(`/food/${foodId}`);
  };

  return (
    <>
      {hits.map((food, index) => (
        <ListItem>
          <HStack
            paddingTop="5px"
            paddingBottom="5px"
            paddingLeft="20px"
            paddingRight="20px"
            key={food.objectID}
            _hover={{ cursor: 'pointer', backgroundColor: 'gray.100' }}
            onClick={() => routeToFood(food.objectID)}
          >
            <Icon as={FiTriangle} />
            <Text px="2">{food.name}</Text>
          </HStack>
        </ListItem>
      ))}
    </>
  );
};

export default FoodSearchHitWrapper;
