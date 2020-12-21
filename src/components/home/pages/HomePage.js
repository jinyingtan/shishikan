import React, { useState, useEffect } from 'react';
import { Flex, Box, Stack, useDisclosure } from '@chakra-ui/react';
import { MaxWidthContainer } from '@components/containers';
import { searchClient } from '@utils/algolia';
import { InstantSearch, Configure, connectInfiniteHits } from 'react-instantsearch-dom';
import { getFood } from '@utils/algolia/filteringRules';
import FoodItemHitsWrapper from '@components/list/modules/FoodItemHitsWrapper';
import { useAuth } from '@components/auth';
import FoodFilterBy from '../modules/FoodFilterBy';

const FoodItemInfiniteHit = connectInfiniteHits(FoodItemHitsWrapper);

const HomePage = () => {
  const auth = useAuth();

  const [verdict, setVerdict] = useState();
  const [price, setPrice] = useState();
  const [category, setCategory] = useState();

  const [latLngFilter, setLatLngFilter] = useState('');

  const onLatLngUpdated = (latLng) => {
    setLatLngFilter(latLng);
  };

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="food"
      onSearchStateChange={(state) => {
        if (state.refinementList?.verdict) {
          setVerdict(state.refinementList.verdict);
        }

        if (state.refinementList?.price) {
          setPrice(state.refinementList.price);
        }

        if (state.refinementList?.category) {
          setCategory(state.refinementList.category);
        }
      }}
    >
      <MaxWidthContainer>
        <Box w="100%" display="flex" justifyContent="center">
          <Stack as={Flex} direction="column" w="100%" maxW="1000px">
            <FoodFilterBy verdict={verdict} category={category} price={price} onLatLngUpdated={onLatLngUpdated} />

            <Configure
              filters={getFood(auth.user?.uid)}
              aroundLatLng={latLngFilter}
              aroundRadius={10000}
              hitsPerPage={8}
            />

            <FoodItemInfiniteHit minHitsPerPage={8} />
          </Stack>
        </Box>
      </MaxWidthContainer>
    </InstantSearch>
  );
};

export default HomePage;
