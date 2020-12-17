import React, { useEffect, useState } from 'react';
import { Stack, HStack, Heading, Button, Box, Tag, TagLabel, TagLeftIcon, Text } from '@chakra-ui/react';
import { MaxWidthContainer } from '@components/containers';
import { LockIcon, UnlockIcon, AddIcon } from '@chakra-ui/icons';
import api from '@api';
import FoodCard from '@components/cards/FoodCard';
import { InstantSearch, Configure, connectInfiniteHits } from 'react-instantsearch-dom';
import { searchClient } from '@utils/algolia';
import FoodItemHitsWrapper from '../modules/FoodItemHitsWrapper';
import { getFoodFromList } from '@utils/algolia/filteringRules';
import { useAuth } from '@components/auth';

const FoodItemInfiniteHit = connectInfiniteHits(FoodItemHitsWrapper);

const ListPage = ({ isMine, list }) => {
  const auth = useAuth();

  return (
    <InstantSearch searchClient={searchClient} indexName="food">
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

            <Configure filters={getFoodFromList(list.id, auth.user?.uid)} hitsPerPage={8} />
            <>
              <FoodItemInfiniteHit minHitsPerPage={8} />
            </>
          </Stack>
        </Box>
      </MaxWidthContainer>
    </InstantSearch>
  );
};

export default ListPage;
