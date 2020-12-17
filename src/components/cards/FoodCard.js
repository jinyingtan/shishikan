import React, { useState } from 'react';
import { Image, Box, Badge, Flex, IconButton, Avatar, Skeleton } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const Cost = ({ cost }) => {
  let value = '';
  if (cost === '1') {
    value = '$';
  } else if (cost === '2') {
    value = '$$';
  } else {
    value = '$$$';
  }

  return (
    <Badge borderRadius="full" px="2" mr="2">
      {value}
    </Badge>
  );
};
const FoodCard = ({
  onClick,
  onBookmarkClick,
  imageUrl,
  imageAlt,
  title,
  description,
  status,
  createdBy,
  cost,
  distance,
  onUserClick,
}) => {

  const [imgLoaded, setImageLoaded] = useState(false);

  return (
    <Box
      minW="xs"
      maxW="sm"
      minH="sm"
      borderWidth="1px"
      borderRadius="lg"
      borderColor="gray.200"
      overflow="hidden"
      _hover={{ cursor: 'pointer' }}
      onClick={() => onClick && onClick()}
    >
      {imageUrl ? (
        <Skeleton isLoaded={imgLoaded}>
          <Image src={imageUrl} alt={imageAlt} height="200px" w="100%" objectFit="cover" onLoad={() => setImageLoaded(true)}/>
        </Skeleton>
      ) : (
        <Box backgroundColor="gray.100" height="52%"></Box>
      )}

      <Box p="6">
        <Flex direction="row">
          <Flex direction="column" flex="10">
            <Box d="flex" alignItems="baseline" fontWeight="semibold" lineHeight="tight" noOfLines={2}>
              {title}
            </Box>

            <Box mt="1" lineHeight="tight">
              {distance && (
                <Badge borderRadius="full" px="2" mr="2">
                  {distance}
                </Badge>
              )}

              <Cost cost={cost} />

              <Badge borderRadius="full" px="2" colorScheme="teal">
                {status}
              </Badge>
            </Box>

            <Box>
              <Box as="span" color="gray.700" fontSize="sm" noOfLines={3}>
                {description}
              </Box>
            </Box>

            <Box
              d="flex"
              mt="2"
              alignItems="center"
              _hover={{ cursor: 'pointer' }}
              onClick={() => onUserClick && onUserClick()}
            >
              <Avatar name={createdBy?.name} src={createdBy?.profileImageUrl} size="xs" mr="1" />
              <Box as="span" color="gray.600" fontSize="xs">
                {createdBy?.name}
              </Box>
            </Box>
          </Flex>

          <Flex flex="1">
            <IconButton
              aria-label="Favourite food"
              icon={<StarIcon />}
              variant="ghost"
              onClick={() => onBookmarkClick && onBookmarkClick()}
            />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default FoodCard;
