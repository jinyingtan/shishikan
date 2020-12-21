import React, { useState } from 'react';
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
  Checkbox,
  useDisclosure,
} from '@chakra-ui/react';
import { StarIcon, AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { connectSortBy, connectRefinementList, InstantSearch } from 'react-instantsearch-dom';
import Filter from './Filter';

import { searchClient } from '@utils/algolia';

const VerdictFilterSettings = connectRefinementList(Filter);
const PriceFilterSettings = connectRefinementList(Filter);
const CategoryFilterSettings = connectRefinementList(Filter);

const VirtualRefinementList = connectRefinementList(() => null);

const FoodFilterBy = ({ verdict, category, price }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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

      <Button size="sm" colorScheme="teal" variant="solid" borderRadius="full">
        Location
      </Button>

      <Modal onClose={onClose} isCentered isOpen={isOpen} lazy>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filter</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VerdictFilterSettings attribute="verdict" title="Verdict" />
            <PriceFilterSettings attribute="price" title="Price" />
            <CategoryFilterSettings attribute="categories.name" title="Category" />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <VirtualRefinementList defaultRefinement={verdict} attribute="verdict" />
      <VirtualRefinementList defaultRefinement={price} attribute="price" />
      <VirtualRefinementList defaultRefinement={category} attribute="categories.name" />
    </Stack>
  );
};

export default FoodFilterBy;
