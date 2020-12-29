import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import { Box, Flex } from '@chakra-ui/react';

const FoodCarousel = ({ images }) => {
  if (!images) {
    return <Box height="300px" width="100%" maxH="325px" padding="10px" backgroundColor="gray.100"></Box>;
  }
  return (
    <Carousel showThumbs={false} showStatus={false} showArrows={false} stopOnHover>
      {images &&
        images.map((image, index) => {
          const { large, raw } = image;
          return (
            <div key={index}>
              <Box height="300px" width="100%" position="relative" maxH="325px" padding="10px">
                <Image layout="fill" objectFit="cover" src={large ? large : raw} />
              </Box>
            </div>
          );
        })}
    </Carousel>
  );
};

export default FoodCarousel;
