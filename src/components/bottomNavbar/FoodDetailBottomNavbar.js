import React, { useState } from 'react';
import {
  Flex,
  Button,
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Stack,
  Textarea,
  RadioGroup,
  Radio,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '@api';
import { FOOD_VERDICT_REVIEW, FOOD_COST } from '@constants/food';
import { useRouter } from 'next/router';

const FoodDetailBottomNavbar = ({ food, list }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    description: Yup.string().required('Required'),
    price: Yup.string().required('Required'),
    verdict: Yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      description: '',
      price: '',
      verdict: '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleAddReview(values);
    },
  });

  const handleAddReview = (values) => {
    const { description, price, verdict } = values;
    const foodId = food.id;
    const listId = list.id;
    setIsLoading(true);
    api.lists
      .addReview(listId, foodId, description, verdict, price)
      .then((doc) => {
        formik.resetForm();
        onClose();
        router.reload();
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: `${error.message}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        formik.setSubmitting(false);
        setIsLoading(false);
      });
  };

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
        position="fixed"
        bottom="0"
        width="100%"
        px="4"
        py="2"
        bg="white"
        boxShadow="base"
        pb="calc(.5rem + env(safe-area-inset-bottom))"
      >
        <Button w="100%" onClick={onOpen}>
          Review
        </Button>
      </Flex>
      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen} closeOnOverlayClick={!isLoading}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Review</DrawerHeader>
            <DrawerBody>
              <Box w="100%" display="flex" justifyContent="center" as="form" onSubmit={formik.handleSubmit}>
                <Stack w="100%" spacing="24px">
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
                    id="price"
                    isRequired
                    isInvalid={formik.touched.price && formik.errors.price}
                    isDisabled={formik.isSubmitting}
                  >
                    <FormLabel as="legend">Affordability</FormLabel>
                    <RadioGroup
                      defaultValue="2"
                      onChange={(value) => {
                        formik.setFieldValue('price', value);
                      }}
                      value={formik.values.price}
                    >
                      <HStack spacing="24px">
                        {Object.entries(FOOD_COST).map((cost) => (
                          <Radio key={cost[1]} id={cost[1]} value={cost[1]}>
                            {cost[0]}
                          </Radio>
                        ))}
                      </HStack>
                    </RadioGroup>

                    <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    as="fieldset"
                    id="verdict"
                    isRequired
                    isInvalid={formik.touched.verdict && formik.errors.verdict}
                    isDisabled={formik.isSubmitting}
                  >
                    <FormLabel as="legend">Verdict</FormLabel>
                    <RadioGroup
                      onChange={(value) => {
                        formik.setFieldValue('verdict', value);
                      }}
                      value={formik.values.verdict}
                    >
                      <Stack direction={['column', 'row']} spacing={['10px', '24px']}>
                        {Object.entries(FOOD_VERDICT_REVIEW).map((verdict) => (
                          <Radio key={verdict[1]} id={verdict[1]} value={verdict[1]}>
                            {verdict[1]}
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
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default FoodDetailBottomNavbar;
