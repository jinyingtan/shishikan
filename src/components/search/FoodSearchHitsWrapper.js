import React from 'react';
import { Icon, HStack, Text } from '@chakra-ui/react';
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
        <HStack key={food.objectID} _hover={{ cursor: 'pointer', backgroundColor: 'gray.100' }} onClick={() => routeToFood(food.objectID)}>
          <Icon as={FiTriangle} />
          <Text px="2">{food.name}</Text>
        </HStack>
      ))}
    </>
  );
};

export default FoodSearchHitWrapper;
