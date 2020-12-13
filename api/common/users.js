import { firebaseAuth } from '@utils/firebase';
import api from '@api';

export const getSharedUserData = async () => {
  const currentUser = firebaseAuth.currentUser;
  if (currentUser === null) {
    // TODO: Find a better way
    return null;
  }
  const userId = currentUser.uid;
  const userSnapshot = await api.users.get(userId);
  if (!userSnapshot.exists) {
    // TODO: Find a better way
    return null;
  }
  const userInfo = userSnapshot.data();
  const userData = {
    id: userInfo.id,
    name: userInfo.username,
    profileImageUrl: userInfo.profileImageUrl,
  };

  return userData;
};
