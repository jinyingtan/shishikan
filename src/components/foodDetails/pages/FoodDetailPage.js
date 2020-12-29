import React from 'react';
import Carousel from '@components/foodDetails/modules/Carousel';
import { Box, Text, Heading, Stack, Link, Tag, Icon } from '@chakra-ui/react';
import { MaxWidthContainer } from '@components/containers';
import { Cost, Verdict } from '@components/cards';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { AiFillTags } from 'react-icons/ai';

const FoodDetailPage = ({ food, isMine }) => {
  console.log(food.categories);
  return (
    <MaxWidthContainer px={{ base: 0, md: '20px' }} mt={{ base: 0, md: '40px' }} maxW="900px">
      <Box w="100%" display="flex" justifyContent="center">
        <Stack w="100%" maxW="1000px" spacing="24px" display="flex" justifyContent="center">
          <Box>
            <Carousel images={food.imageUrls} />
          </Box>

          <Stack px="3">
            <Heading>{food.name}</Heading>

            <Box lineHeight="tight">
              <Cost cost={food.price} />

              <Verdict verdict={food.verdict} />
            </Box>

            <Box lineHeight="tight">
              In{' '}
              {food.categories.map((category) => (
                <>
                  <Tag as={Link} href={`/category/${category.id}`} mr="1">
                    {category.name}
                  </Tag>
                </>
              ))}
            </Box>

            <Box lineHeight="tight">
              <Text>{food.description}</Text>
            </Box>

            <Heading as="h6" size="xs">
              Location:
            </Heading>
            <Link color="gray.500" isExternal href={`https://www.google.com/maps/search/${food.address.name}`}>
              {food.address.name} <ExternalLinkIcon mx="2px" />
            </Link>

            <Stack direction="row">
              <Icon as={AiFillTags} />
              {food.tags.map((tag) => (
                <Tag mr="1" colorScheme="cyan">
                  {tag.name}
                </Tag>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </MaxWidthContainer>
  );
};

export default FoodDetailPage;
