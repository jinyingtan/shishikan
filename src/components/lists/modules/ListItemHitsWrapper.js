import React, { useEffect, useRef, useState } from 'react';
import { VStack, StackDivider, Skeleton } from '@chakra-ui/react';
import ListCard from '@components/cards/ListCard';

/**
 * https://www.algolia.com/doc/api-reference/widgets/infinite-hits/react/#create-a-react-component
 * @param {object[]} hits
 * @param {object} category
 * @param {boolean} hasPrevious
 * @param {boolean} hasMore
 * @param {function} refinePrevious
 * @param {function} refineNext
 */
const ListItemHitsWrapper = ({ hits, hasPrevious, hasMore, refinePrevious, refineNext, refine, isFirst, onEditClick }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [hits]);

  return (
    <>
      <VStack divider={<StackDivider borderColor="gray.200" />} spacing={4} align="stretch">
        {hits.length === 0 && loading
          ? [0, 1, 2].map((value) => {
              return <Skeleton h="50px" w="100%" key={value} />;
            })
          : null}

        {hits.length > 0 &&
          hits.map((list, index) => (
            <ListCard key={index} title={list.name} visibility={list.visibility} id={list.objectID} onEditClick={onEditClick} />
          ))}
      </VStack>
    </>
  );
};

export default ListItemHitsWrapper;
