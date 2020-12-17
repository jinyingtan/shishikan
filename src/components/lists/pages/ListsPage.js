import React from 'react';
import { MaxWidthContainer } from '@components/containers';
import { VStack, Flex, Stack, Heading, StackDivider } from '@chakra-ui/react';
import { InstantSearch, Configure, connectInfiniteHits } from 'react-instantsearch-dom';
import { searchClient } from '@utils/algolia';
import ListItemHitsWrapper from '@components/lists/modules/ListItemHitsWrapper';
import { useAuth } from '@components/auth';

const ListItemInfiniteHit = connectInfiniteHits(ListItemHitsWrapper);

const ListsPage = () => {
  const auth = useAuth();

  return (
    <InstantSearch searchClient={searchClient} indexName="lists">
      <MaxWidthContainer>
        <Stack direction={{ base: 'column', md: 'row' }} w="100%">
          <Flex
            flex="1"
            px="20px"
            py="30px"
            direction="column"
            borderWidth="1px"
            borderRadius="lg"
            borderColor="gray.200"
          >
            <Heading as="h4" size="xs" mb={4}>
              Your lists
            </Heading>

            <Configure filters={`user.id:'${auth.user?.uid}'`} hitsPerPage={8} />
            <>
              <ListItemInfiniteHit minHitsPerPage={8} />
            </>
          </Flex>

          <Flex
            flex="1"
            px="20px"
            py="30px"
            direction="column"
            borderWidth="1px"
            borderRadius="lg"
            borderColor="gray.200"
          >
            <Heading as="h4" size="xs" mb={4}>
              Lists you follow
            </Heading>

            <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4} align="stretch"></VStack>
          </Flex>
        </Stack>
      </MaxWidthContainer>
    </InstantSearch>
  );
};

export default ListsPage;
