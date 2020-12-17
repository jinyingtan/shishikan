import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
  Input,
  Stack,
  Textarea,
  RadioGroup,
  Radio,
  HStack,
  Heading,
  Button,
  Box,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
  Text,
  SimpleGrid,
  Flex,
  Skeleton,
} from '@chakra-ui/react';
import { MaxWidthContainer } from '@components/containers';
import { LockIcon, UnlockIcon, AddIcon } from '@chakra-ui/icons';
import api from '@api';
import FoodCard from '@components/cards/FoodCard';

const property = {
  imageUrl: 'https://lh5.googleusercontent.com/p/AF1QipNl458h1vhLhP7LVVkXRxJQuhdcGxfLH624hxtA=w408-h273-k-no',
  imageAlt: 'Rear view of modern home with pool',
  title: 'Yan Mookata Toa Payoh',
  description:
    'Sorry the pics are not very nice as I realize I didn’t take pics before eating except for the fried chicken one.. that’s the best tasting actually. $5-5.50 per plate with soup. Quite reasonable. Ordered fried chicken, seafood fried rice and olive fried rice.',
  status: 'Can Go!',
  createdBy: {
    name: 'Koh Chi Hao',
    profileImageUrl: 'https://bit.ly/2Z4KKcF',
  },
  cost: '$$',
  distance: '4.8km',
};

const property1 = {
  title: 'Yan Mookata Toa Payoh',
  description:
    'Sorry the pics are not very nice as I realize I didn’t take pics before eating except for the fried chicken one.. that’s the best tasting actually. $5-5.50 per plate with soup. Quite reasonable. Ordered fried chicken, seafood fried rice and olive fried rice.',
  status: 'Can Go!',
  createdBy: {
    name: 'Koh Chi Hao',
    profileImageUrl: 'https://bit.ly/2Z4KKcF',
  },
  cost: '$$',
  distance: '4.8km',
};
const ListPage = ({ isMine, list }) => {
  const [foods, setFoods] = useState([]);
  const [foodLoading, setFoodLoading] = useState(true);

  useEffect(() => {
    api.lists.getFoods(list.id).then((docs) => {
      const foods = docs.map((doc) => doc.data());
      setFoods(foods);
      setFoodLoading(false);
    });
  }, []);

  return (
    <MaxWidthContainer>
      <Box w="100%" display="flex" justifyContent="center">
        <Stack w="100%" maxW="1000px" spacing="24px" display="flex" justifyContent="center">
          <Heading justifyContent="center" display="flex">
            {list.name}
          </Heading>
          <Box justifyContent="center" display="flex">
            {list.visibility === 'private' ? (
              <Tag size="sm" key="sm" variant="subtle" colorScheme="red">
                <TagLeftIcon boxSize="12px" as={LockIcon} />
                <TagLabel>Private</TagLabel>
              </Tag>
            ) : (
              <Tag size="sm" key="sm" variant="subtle" colorScheme="cyan">
                <TagLeftIcon boxSize="12px" as={UnlockIcon} />
                <TagLabel>Public</TagLabel>
              </Tag>
            )}
          </Box>

          <Text noOfLines={8} align="center">
            {list.description}
          </Text>

          <HStack justifyContent="center" display="flex">
            <Button leftIcon={<AddIcon />} variant="outline" borderRadius="100px">
              Add
            </Button>
          </HStack>

          <SimpleGrid minChildWidth="300px" spacing={5}>
            {foods.length === 0 && foodLoading
              ? [0, 1, 2, 3, 4].map(() => {
                  return <Skeleton h="380px" w="320px" borderRadius="lg"></Skeleton>;
                })
              : null}
              
            {foods.length > 0 &&
              foods.map((food) => (
                <FoodCard
                  imageUrl={food.coverImageUrl?.small || food.coverImageUrl?.raw}
                  imageAlt="Food Image"
                  title={food.name}
                  description={food.description}
                  status={food.verdict}
                  cost={food.price}
                  createdBy={{ name: food.user.name, profileImageUrl: food.user.profileImageUrl.raw }}
                />
              ))}
          </SimpleGrid>
        </Stack>
      </Box>
    </MaxWidthContainer>
  );
};

export default ListPage;
