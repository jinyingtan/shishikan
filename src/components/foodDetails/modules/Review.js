import React from 'react';
import { Text, Stack, Avatar } from '@chakra-ui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const Review = ({ user, description, createdAt }) => {
  return (
    <Stack direction="row">
      <Avatar name={user?.name} src={user?.profileImageUrl?.raw} />
      <Stack direction="column">
        <Text>{description}</Text>

        <Stack spacing="0">
          <Text color="gray.500" fontSize="sm">
            {user?.name}
          </Text>

          <Text color="gray.500" fontSize="sm">
            {dayjs(createdAt).fromNow()}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Review;
