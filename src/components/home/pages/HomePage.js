import React, { useState, useEffect } from 'react';
import { Flex, Box, Stack, useDisclosure } from '@chakra-ui/react';
import { MaxWidthContainer } from '@components/containers';
import { searchClient } from '@utils/algolia';
import { InstantSearch, Configure, connectInfiniteHits, connectRefinementList } from 'react-instantsearch-dom';
import { getFood } from '@utils/algolia/filteringRules';
import FoodItemHitsWrapper from '@components/list/modules/FoodItemHitsWrapper';
import { useAuth } from '@components/auth';
import FoodFilterBy from '../modules/FoodFilterBy';
import UnAuthHomePage from '@components/home/modules/UnAuthHomePage';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const FoodItemInfiniteHit = connectInfiniteHits(FoodItemHitsWrapper);
const VirtualRefinementList = connectRefinementList(() => null);

const HomePage = ({ around, ...rest }) => {
  const auth = useAuth();

  const [latLngFilter, setLatLngFilter] = useState('');

  const [searchState, setSearchState] = useState({});

  const onLatLngUpdated = (latLng) => {
    setLatLngFilter(latLng);
  };

  const onSearchStateChange = (searchState) => {
    setSearchState(searchState);
  };

  useEffect(() => {
    if (around) {
      geocodeByAddress(around)
        .then((results) => getLatLng(results[0]))
        .then((latLng) => {
          const { lat, lng } = latLng;
          onLatLngUpdated(`${lat},${lng}`);
        })
        .catch((error) => console.error('Error', error));
    } else {
      onLatLngUpdated('');
    }
  }, [around]);

  if (!auth.user) {
    return (
      <UnAuthHomePage
        title="Welcome to ShiShiKan"
        subtitle="The place where you store your foodlist and manage them!"
        image={`https://images.unsplash.com/photo-1505826759037-406b40feb4cd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2552&q=80`}
      />
    );
  }

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
