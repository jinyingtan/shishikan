import React, { useState, useEffect } from 'react';
import { Flex, Box, Stack, useDisclosure } from '@chakra-ui/react';
import { MaxWidthContainer } from '@components/containers';
import { searchClient } from '@utils/algolia';
import { InstantSearch, Configure, connectInfiniteHits, connectRefinementList } from 'react-instantsearch-dom';
import { getFood } from '@utils/algolia/filteringRules';
import FoodItemHitsWrapper from '@components/list/modules/FoodItemHitsWrapper';
import { useAuth } from '@components/auth';
import FoodFilterBy from '../modules/FoodFilterBy';

const FoodItemInfiniteHit = connectInfiniteHits(FoodItemHitsWrapper);
const VirtualRefinementList = connectRefinementList(() => null);

const HomePage = () => {
  const auth = useAuth();

  const [latLngFilter, setLatLngFilter] = useState('');

  const [searchState, setSearchState] = useState({});

  const onLatLngUpdated = (latLng) => {
    setLatLngFilter(latLng);
  };

  const onSearchStateChange = (searchState) => {
    setSearchState(searchState);
  };

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="food"
      searchState={searchState}
      onSearchStateChange={onSearchStateChange}
    >
      <MaxWidthContainer>
        <Box w="100%" display="flex" justifyContent="center">
          <Stack as={Flex} direction="column" w="100%" maxW="1000px">
            <FoodFilterBy
              onLatLngUpdated={onLatLngUpdated}
              searchState={searchState}
              onSearchStateChange={onSearchStateChange}
            />

            <Configure
              filters={getFood(auth.user?.uid)}
              aroundLatLng={latLngFilter}
              aroundRadius={10000}
              hitsPerPage={21}
            />

            <FoodItemInfiniteHit minHitsPerPage={21} />
          </Stack>
        </Box>

        <VirtualRefinementList attribute="verdict" />
        <VirtualRefinementList attribute="price" />
        <VirtualRefinementList attribute="categories.name" />
      </MaxWidthContainer>
    </InstantSearch>
  );
};

export default HomePage;
