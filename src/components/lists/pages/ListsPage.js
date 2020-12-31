import React, { useState } from 'react';
import { MaxWidthContainer } from '@components/containers';
import {
  VStack,
  Flex,
  Stack,
  Heading,
  StackDivider,
  Button,
  Box,
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
  FormHelperText,
  Input,
  Textarea,
  Radio,
  RadioGroup,
  useToast,
} from '@chakra-ui/react';
import { InstantSearch, Configure, connectInfiniteHits } from 'react-instantsearch-dom';
import { searchClient } from '@utils/algolia';
import ListItemHitsWrapper from '@components/lists/modules/ListItemHitsWrapper';
import { useAuth } from '@components/auth';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '@api';
import { LIST_VISIBILITY } from '@constants/lists';
import { useRouter } from 'next/router';

const ListItemInfiniteHit = connectInfiniteHits(ListItemHitsWrapper);

const ListsPage = () => {
  const auth = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Required')
      .min(1, 'A name must be provided')
      .max(140, 'Name too long and exceeds 140 character limit'),
    description: Yup.string().required('Required'),
    visibility: Yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      visibility: '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleCreateList(values);
    },
  });

  const handleCreateList = (values) => {
    const { name, description, visibility } = values;
    console.log(values);
    setIsLoading(true);
    api.lists
      .createList(name, description, null, visibility)
      .then((snapshot) => {
        router.reload();
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="lists">
      <MaxWidthContainer>
        <Stack as={Flex} direction="column" w="100%">
          <Box>
            <Button onClick={onOpen}>Create a list</Button>
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
        </Stack>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create a list</ModalHeader>
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
                      value={formik.values.verdict}
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
      </MaxWidthContainer>
    </InstantSearch>
  );
};

export default ListsPage;
