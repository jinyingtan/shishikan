import React, { useState, useEffect } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
  Flex,
  Input,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  HStack,
  Icon,
  Box,
} from '@chakra-ui/react';
import { InstantSearch, Configure, connectHits } from 'react-instantsearch-dom';
import { searchClient } from '@utils/algolia';
import FoodSearchHitsWrapper from './FoodSearchHitsWrapper';
import { IoLocationOutline } from 'react-icons/io5';
import { useRouter } from 'next/router';
import { useAuth } from '@components/auth';
import { getFood } from '@utils/algolia/filteringRules';
import useDebouncedEffect from '@utils/hooks/useDebouncedEffect';
import { useGoogleMaps } from '@components/googleMaps';

const FoodSearchHits = connectHits(FoodSearchHitsWrapper);

const Searchbar = ({ ...rest }) => {
  const [search, setSearch] = useState('');
  const [algoliaSearch, setAlgoliaSearch] = useState('');
  const router = useRouter();
  const auth = useAuth();
  const googleMaps = useGoogleMaps();

  useDebouncedEffect(
    () => {
      setAlgoliaSearch(search);
    },
    200,
    [search]
  );

  const handlePlacesChange = (address) => {
    setSearch(address);
  };

  const handlePlacesSelect = (address) => {
    setSearch('');
    router.push(`/?around=${address}`);
  };

  if (!auth.user) {
    return <Box></Box>;
  }

  return (
    <InstantSearch searchClient={searchClient} indexName="food">
      <Flex flex="3" {...rest}>
        <Configure hitsPerPage={5} query={algoliaSearch} filters={getFood(auth?.user?.uid)} />
        {googleMaps.isLoaded ? (
          <PlacesAutocomplete
            value={search}
            onChange={handlePlacesChange}
            onSelect={handlePlacesSelect}
            shouldFetchSuggestions={search.length > 3}
            googleCallbackName="mapCallback"
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
              return (
                <>
                  <Popover
                    placement="bottom-start"
                    returnFocusOnClose={false}
                    isOpen={search.length > 3 || suggestions.length > 0}
                    closeOnBlur={true}
                    autoFocus={false}
                  >
                    <PopoverTrigger>
                      <Input placeholder="Search for lists, foods, users" borderColor="gray.200" {...getInputProps()} />
                    </PopoverTrigger>
                    <PopoverContent minW={{ base: '95vw', md: '50vw' }}>
                      <PopoverBody>
                        {loading && (
                          <Text py="10px" px="2">
                            Loading...
                          </Text>
                        )}
                        <VStack align="stretch">
                          {suggestions.map((suggestion) => {
                            return (
                              <HStack
                                key={suggestion.placeId}
                                _hover={{ cursor: 'pointer', backgroundColor: 'gray.100' }}
                              >
                                <Icon as={IoLocationOutline} />
                                <Text px="2" {...getSuggestionItemProps(suggestion)} mt="0px">
                                  {suggestion.description}
                                </Text>
                              </HStack>
                            );
                          })}

                          <FoodSearchHits />
                        </VStack>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </>
              );
            }}
          </PlacesAutocomplete>
        ) : null}
      </Flex>
    </InstantSearch>
  );
};

export default Searchbar;
