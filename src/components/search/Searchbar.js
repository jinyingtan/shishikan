import React, { useState } from 'react';
import Head from 'next/head';
import { GOOGLE_PLACE_AUTOCOMPLETE_URL } from '@constants/google';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import {
  Flex,
  Input,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  StackDivider,
  Text,
} from '@chakra-ui/react';
const Searchbar = () => {
  const [isSearchOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const [address, setAddress] = useState('');

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => console.log('Success', latLng))
      .catch((error) => console.error('Error', error));
  };

  return (
    <>
      <Head>
        <script src={GOOGLE_PLACE_AUTOCOMPLETE_URL}></script>
      </Head>
      <Flex flex="3">
        <PlacesAutocomplete
          value={address}
          onChange={handleChange}
          onSelect={handleSelect}
          shouldFetchSuggestions={address.length > 3}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
            return (
              <>
                <Popover
                  placement="bottom-start"
                  returnFocusOnClose={false}
                  isOpen={address.length > 3 && suggestions.length > 0}
                  onClose={close}
                  closeOnBlur={false}
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
                      <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4} align="stretch">
                        {suggestions.map((suggestion) => {
                          return (
                            <Text
                              _hover={{ cursor: 'pointer', backgroundColor: 'gray.100' }}
                              py="10px"
                              px="2"
                              {...getSuggestionItemProps(suggestion)}
                            >
                              {suggestion.description}
                            </Text>
                          );
                        })}
                      </VStack>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </>
            );
          }}
        </PlacesAutocomplete>
      </Flex>
    </>
  );
};

export default Searchbar;
