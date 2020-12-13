import { firebaseAuth } from '@utils/firebase';
import api from '@api';
import UsersError from '../error/usersError';

export const getSharedUserData = async () => {
  const currentUser = firebaseAuth.currentUser;
  if (currentUser === null) {
    throw new UsersError('invalid-user', 'current user is null');
  }
  const userId = currentUser.uid;
  const userSnapshot = await api.users.get(userId);
  if (!userSnapshot.exists) {
    throw new UsersError('invalid-user', 'user data does not exist');
  }
  const userInfo = userSnapshot.data();
  const userData = {
    id: userInfo.id,
    name: userInfo.username,
    profileImageUrl: userInfo.profileImageUrl,
  };

  return userData;
};
