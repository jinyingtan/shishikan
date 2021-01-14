import React, { useState } from 'react';
import { MaxWidthContainer } from '@components/containers';
import { VStack, Flex, Stack, Heading, StackDivider, Button, Box, useDisclosure, IconButton } from '@chakra-ui/react';
import { InstantSearch, Configure, connectInfiniteHits } from 'react-instantsearch-dom';
import { searchClient } from '@utils/algolia';
import ListItemHitsWrapper from '@components/lists/modules/ListItemHitsWrapper';
import { useAuth } from '@components/auth';
import api from '@api';
import { useRouter } from 'next/router';
import { IoIosRefresh } from 'react-icons/io';
import CreateListModal from '@components/modals/CreateListModal';

const ListItemInfiniteHit = connectInfiniteHits(ListItemHitsWrapper);

const ListsPage = () => {
  const auth = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [list, setList] = useState();
  const [editId, setEditId] = useState();
  const [modalLoading, setModalLoading] = useState(false);

  const handleEditClick = (id) => {
    onOpen();
    setModalLoading(true);
    api.lists.getList(id).then((snapshot) => {
      const data = snapshot.data();
      const editList = {
        name: data.name,
        description: data.description,
      };
      setList(editList);
      setEditId(id);
      setModalLoading(false);
    });
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="lists">
      <MaxWidthContainer>
        <Stack as={Flex} direction="column" w="100%">
          <Box>
            <Stack direction="row">
              <Button onClick={onOpen}>Create a list</Button>
              <IconButton aria-label="refresh page" icon={<IoIosRefresh />} onClick={() => router.reload()} />
            </Stack>
          </Box>

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

              <Configure filters={`user.id:'${auth.user?.uid}'`} hitsPerPage={20} />

              <ListItemInfiniteHit minHitsPerPage={20} onEditClick={handleEditClick} />
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
        </Stack>

        <CreateListModal list={list} editId={editId} isLoading={modalLoading} onClose={onClose} isOpen={isOpen} />
      </MaxWidthContainer>
    </InstantSearch>
  );
};

export default ListsPage;
