import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SimpleGrid, Skeleton, Box } from '@chakra-ui/react';
import FoodCard from '@components/cards/FoodCard';

/**
 * https://www.algolia.com/doc/api-reference/widgets/infinite-hits/react/#create-a-react-component
 * @param {object[]} hits
 * @param {object} category
 * @param {boolean} hasPrevious
 * @param {boolean} hasMore
 * @param {function} refinePrevious
 * @param {function} refineNext
 */
const FoodItemHitWrapper = ({ hits, hasPrevious, hasMore, refinePrevious, refineNext, refine, isFirst }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [hits]);

  const sentinel = useRef(null);

  const onSentinelIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && hasMore) {
        refineNext();
      }
    });
  });

  useEffect(() => {
    if (sentinel) {
      const observer = new IntersectionObserver(onSentinelIntersection);
      observer.observe(sentinel.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [sentinel, onSentinelIntersection]);

  return (
    <>
      <SimpleGrid minChildWidth="300px" spacing={5}>
        {hits.length === 0 && loading
          ? [0, 1, 2, 3, 4].map((value) => {
              return <Skeleton h="380px" w="320px" borderRadius="lg" key={value} />;
            })
          : null}

        {hits.length > 0 &&
          hits.map((food, index) => (
            <FoodCard
              key={`${index}`}
              imageUrl={food.coverImageUrl?.small || food.coverImageUrl?.raw}
              imageAlt="Food Image"
              title={food.name}
              description={food.description}
              status={food.verdict}
              cost={food.price}
              createdBy={{ name: food.user.name, profileImageUrl: food.user.profileImageUrl.raw }}
            />
          ))}
        <li ref={sentinel} style={{ listStyleType: 'none' }} />
      </SimpleGrid>
    </>
  );
};

export default FoodItemHitWrapper;
