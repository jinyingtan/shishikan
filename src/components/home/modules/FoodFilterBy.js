import React, { useEffect, useState } from 'react';
import {
  Flex,
  Button,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { connectRefinementList, InstantSearch } from 'react-instantsearch-dom';
import Filter from './Filter';
import { searchClient } from '@utils/algolia';

const VerdictFilterSettings = connectRefinementList(Filter);
const PriceFilterSettings = connectRefinementList(Filter);
const CategoryFilterSettings = connectRefinementList(Filter);

const FoodFilterBy = ({ onLatLngUpdated, searchState, onSearchStateChange }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const onLocationClick = () => {
    if (navigator.geolocation) {
      setIsLocationLoading(true);
      navigator.geolocation.getCurrentPosition((position) => {
        setIsLocationLoading(false);
        const latLng = `${position.coords.latitude},${position.coords.longitude}`;
        onLatLngUpdated(latLng);
      });
    }
  };

  return (
    <Stack as={Flex} direction="row" spacing="10px">
      <Button
        size="sm"
        rightIcon={<ChevronDownIcon />}
        colorScheme="teal"
        variant="solid"
        borderRadius="full"
        onClick={onOpen}
      >
        Filter
      </Button>

      <Button
        size="sm"
        colorScheme="teal"
        variant="solid"
        borderRadius="full"
        isLoading={isLocationLoading}
        onClick={onLocationClick}
      >
        Location
      </Button>

      <Modal onClose={onClose} isCentered isOpen={isOpen} lazy>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filter</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InstantSearch
              searchClient={searchClient}
              indexName="food"
              searchState={searchState}
              onSearchStateChange={onSearchStateChange}
            >
              <VerdictFilterSettings attribute="verdict" title="Verdict" />
              <PriceFilterSettings attribute="price" title="Price" />
              <CategoryFilterSettings attribute="categories.name" title="Category" />
            </InstantSearch>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default FoodFilterBy;
