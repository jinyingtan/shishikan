import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import { Box, Flex } from '@chakra-ui/react';

const FoodCarousel = ({ images }) => {
  return (
    <Carousel showThumbs={false} showStatus={false} showArrows={false} stopOnHover>
      {images.map((image, index) => {
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
