import React, { useEffect, useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { Flex, Input, Text, HStack, Icon, Box, List, ListItem } from '@chakra-ui/react';
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
  const [googleResults, setGoogleResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

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

  useEffect(() => {
    if (search.length > 3 || googleResults.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [search]);

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
              if (suggestions.length > 0) {
                setGoogleResults(suggestions);
              }
              return (
                <>
                  <Flex flexDirection="column" w="100%" h="100%" position="relative">
                    <Input
                      placeholder="Search for lists, foods, users"
                      borderColor="gray.200"
                      {...getInputProps()}
                      onBlur={() => {
                        setTimeout(() => {
                          setShowResults(false);
                        }, 500);
                      }}
                    />

                    <List
                      display={showResults ? 'block' : 'none'}
                      position="absolute"
                      left="0"
                      right="0"
                      top="calc(100% + 10px)"
                      zIndex="999"
                      spacing={1}
                      backgroundColor="white"
                      boxShadow="0 2px 4px rgba(0,0,0,.12)"
                      paddingTop="5px"
                      paddingBottom="5px"
                      borderRadius="lg"
                      borderColor="gray.200"
                      borderWidth="1px"
                    >
                      {googleResults.map((suggestion) => {
                        return (
                          <ListItem>
                            <HStack
                              paddingTop="5px"
                              paddingBottom="5px"
                              paddingLeft="20px"
                              paddingRight="20px"
                              key={suggestion.placeId}
                              _hover={{ cursor: 'pointer', backgroundColor: 'gray.100' }}
                              {...getSuggestionItemProps(suggestion)}
                            >
                              <Icon as={IoLocationOutline} />
                              <Text px="2" mt="0px">
                                {suggestion.description}
                              </Text>
                            </HStack>
                          </ListItem>
                        );
                      })}
                      <FoodSearchHits />
                    </List>
                  </Flex>
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
