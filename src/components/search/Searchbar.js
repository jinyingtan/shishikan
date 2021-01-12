import React, { useState } from 'react';
import Head from 'next/head';
import { GOOGLE_PLACE_AUTOCOMPLETE_URL } from '@constants/google';
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
} from '@chakra-ui/react';
import { InstantSearch, Configure, connectHits } from 'react-instantsearch-dom';
import { searchClient } from '@utils/algolia';
import FoodSearchHitsWrapper from './FoodSearchHitsWrapper';
import { IoLocationOutline } from 'react-icons/io5';
import { useRouter } from 'next/router';

const FoodSearchHits = connectHits(FoodSearchHitsWrapper);

const Searchbar = () => {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handlePlacesChange = (address) => {
    setSearch(address);
  };

  const handlePlacesSelect = (address) => {
    setSearch('');
    router.push(`/?around=${address}`);
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="food">
      <Head>
        <script src={GOOGLE_PLACE_AUTOCOMPLETE_URL}></script>
      </Head>
      <Flex flex="3">
        <Configure hitsPerPage={8} />
        <PlacesAutocomplete
          value={search}
          onChange={handlePlacesChange}
          onSelect={handlePlacesSelect}
          shouldFetchSuggestions={search.length > 3}
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
                  <PopoverContent minW="800px">
                    <PopoverBody>
                      {loading && (
                        <Text py="10px" px="2">
                          Loading...
                        </Text>
                      )}
                      <VStack align="stretch">
                        {suggestions.map((suggestion) => {
                          return (
                            <HStack _hover={{ cursor: 'pointer', backgroundColor: 'gray.100' }}>
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
      </Flex>
    </InstantSearch>
  );
};

export default Searchbar;
