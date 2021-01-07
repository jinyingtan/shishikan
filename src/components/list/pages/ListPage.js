import React, { useState } from 'react';
import {
  Stack,
  HStack,
  Heading,
  Button,
  Box,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Radio,
  RadioGroup,
  useToast,
} from '@chakra-ui/react';
import { MaxWidthContainer } from '@components/containers';
import { LockIcon, UnlockIcon, AddIcon, EditIcon } from '@chakra-ui/icons';
import { InstantSearch, Configure, connectInfiniteHits } from 'react-instantsearch-dom';
import { searchClient } from '@utils/algolia';
import FoodItemHitsWrapper from '../modules/FoodItemHitsWrapper';
import { getFoodFromList } from '@utils/algolia/filteringRules';
import { useAuth } from '@components/auth';
import { useRouter } from 'next/router';
import { IoIosRefresh } from 'react-icons/io';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LIST_VISIBILITY } from '@constants/lists';
import api from '@api';

const FoodItemInfiniteHit = connectInfiniteHits(FoodItemHitsWrapper);

const ListPage = ({ isMine, list }) => {
  const auth = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [editList, setEditList] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const routeToAddPage = () => {
    router.push(`/add?listId=${list.id}`);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Required')
      .min(1, 'A name must be provided')
      .max(140, 'Name too long and exceeds 140 character limit'),
    description: Yup.string().required('Required'),
    visibility: Yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: editList || {
      name: '',
      description: '',
      visibility: '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleEditList(values);
    },
  });

  const handleEditList = async (values) => {
    try {
      const { name, description, visibility } = values;
      setIsLoading(true);
      const snapshot = await api.lists.updateList(list.id, name, description, null, visibility);
      router.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      formik.setSubmitting(false);
      setIsLoading(false);
      setEditList();
    }
  };

  const handleEditClick = () => {
    onOpen();
    const editList = {
      name: list.name,
      description: list.description,
      visibility: list.visibility,
    };
    setEditList(editList);
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="food">
      <MaxWidthContainer>
        <Box w="100%" display="flex" justifyContent="center">
          <Stack w="100%" maxW="1000px" spacing="24px" display="flex" justifyContent="center">
            <Heading justifyContent="center" display="flex">
              {list.name}
            </Heading>
            <Box justifyContent="center" display="flex">
              {list.visibility === 'private' ? (
                <Tag size="sm" key="sm" variant="subtle" colorScheme="red">
                  <TagLeftIcon boxSize="12px" as={LockIcon} />
                  <TagLabel>Private</TagLabel>
                </Tag>
              ) : (
                <Tag size="sm" key="sm" variant="subtle" colorScheme="cyan">
                  <TagLeftIcon boxSize="12px" as={UnlockIcon} />
                  <TagLabel>Public</TagLabel>
                </Tag>
              )}
            </Box>

            <Text noOfLines={8} align="center">
              {list.description}
            </Text>

            <HStack justifyContent="center" display="flex">
              <Button leftIcon={<AddIcon />} variant="outline" borderRadius="100px" onClick={routeToAddPage}>
                Add
              </Button>

              <Button leftIcon={<EditIcon />} variant="outline" borderRadius="100px" onClick={handleEditClick}>
                Edit
              </Button>

              <IconButton
                aria-label="refresh page"
                icon={<IoIosRefresh />}
                onClick={() => router.reload()}
                variant="outline"
                borderRadius="100px"
              />
            </HStack>

            <Configure filters={getFoodFromList(list.id, auth.user?.uid)} hitsPerPage={8} />
            <>
              <FoodItemInfiniteHit minHitsPerPage={8} />
            </>
          </Stack>
        </Box>
      </MaxWidthContainer>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setList();
          setEditId();
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit a list</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" justifyContent="center" as="form" onSubmit={formik.handleSubmit}>
              <Stack w="100%" maxW="800px" spacing="24px">
                <FormControl
                  id="name"
                  isRequired
                  isInvalid={formik.errors.name && formik.touched.name}
                  isDisabled={formik.isSubmitting}
                >
                  <FormLabel>Name</FormLabel>
                  <Input id="name" placeholder="name" {...formik.getFieldProps('name')} />
                  <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl
                  id="description"
                  isRequired
                  isInvalid={formik.touched.description && formik.errors.description}
                  isDisabled={formik.isSubmitting}
                >
                  <FormLabel>Description</FormLabel>
                  <Textarea id="description" placeholder="description" {...formik.getFieldProps('description')} />
                  <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
                </FormControl>

                <FormControl
                  as="fieldset"
                  id="visibility"
                  isRequired
                  isInvalid={formik.touched.visibility && formik.errors.visibility}
                  isDisabled={formik.isSubmitting}
                >
                  <FormLabel as="legend">Visibility</FormLabel>
                  <RadioGroup
                    onChange={(value) => {
                      formik.setFieldValue('visibility', value);
                    }}
                    value={formik.values.visibility}
                  >
                    <Stack direction={['column', 'row']} spacing={['10px', '24px']}>
                      {Object.entries(LIST_VISIBILITY).map((visibility) => (
                        <Radio key={visibility[1]} id={visibility[1]} value={visibility[1]}>
                          {visibility[1]}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                  <FormErrorMessage>{formik.errors.verdict}</FormErrorMessage>
                </FormControl>

                <Button type="submit" isLoading={isLoading} isDisabled={formik.isSubmitting}>
                  Submit
                </Button>
              </Stack>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </InstantSearch>
  );
};

export default ListPage;
