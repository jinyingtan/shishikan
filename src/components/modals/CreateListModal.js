import React, { useEffect, useState } from 'react';
import {
  Stack,
  Button,
  Box,
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
  CircularProgress,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '@api';
import { LIST_VISIBILITY } from '@constants/lists';
import { useRouter } from 'next/router';

const CreateListModal = ({ list, editId, isLoading, onOpen, onClose, isOpen }) => {
  const [isFormLoading, setIsFormLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Required')
      .min(1, 'A name must be provided')
      .max(140, 'Name too long and exceeds 140 character limit'),
    description: Yup.string().required('Required'),
    visibility: Yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: list || {
      name: '',
      description: '',
      visibility: '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (list) {
        handleEditList(values);
      } else {
        handleCreateList(values);
      }
    },
  });

  const handleCreateList = async (values) => {
    try {
      const { name, description, visibility } = values;
      setIsFormLoading(true);
      const snapshot = await api.lists.createList(name, description, null, visibility);
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
      setIsFormLoading(false);
    }
  };

  const handleEditList = async (values) => {
    try {
      const { name, description, visibility } = values;
      setIsFormLoading(true);
      const snapshot = await api.lists.updateList(editId, name, description, null, visibility);
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
      setIsFormLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        {isLoading ? (
          <CircularProgress isIndeterminate color="green.300" display="flex" justifyContent="center" p="4" />
        ) : (
          <>
            <ModalHeader>{list ? 'Edit' : 'Create'} a list</ModalHeader>
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

                  <Button type="submit" isLoading={isFormLoading} isDisabled={formik.isSubmitting}>
                    Submit
                  </Button>
                </Stack>
              </Box>
            </ModalBody>
          </>
        )}

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateListModal;
