import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db, firebaseAuth, firebase } from '@utils/firebase';
import api from '@api';
import { LIST_VISIBILITY } from '@constants/lists';
import { isValidListVisibility } from '@constants/lists';
import { uploadImage } from './common/images';
import ListsError from './error/listsError';

const listsCollection = db.collection('lists');

class ListsAPI {
  createList = async (name, description = '', image = null, visibility = LIST_VISIBILITY.PUBLIC) => {
    const currentUser = firebaseAuth.currentUser;
    if (currentUser === null) {
      throw new ListsError('invalid-user', 'current user is null');
    }
    const userId = currentUser.uid;

    if (!isValidListVisibility(visibility)) {
      throw new ListsError(
        'invalid-visibility-value',
        `visibility can only take values of ${Object.values(LIST_VISIBILITY)}`
      );
    }

    const userRef = await api.users.get(userId);
    if (!userRef.exists) {
      throw new ListsError('invalid-user', 'failed to fetch user info');
    }
    const userInfo = userRef.data();
    const userData = {
      id: userInfo.id,
      name: userInfo.username,
      profileImageUrl: userInfo.profileImageUrl,
    };

    const newList = listsCollection.doc();
    const timeNow = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      id: newList.id,
      name,
      description,
      visibility,
      user: userData,
      createdAt: timeNow,
      updatedAt: timeNow,
    };

    if (image !== null) {
      const uploadPath = `lists/${newList.id}/`;
      const ext = path.extname(image.name);
      const imageName = `${newList.id}_${Date.now()}_${uuidv4()}${ext}`;
      const imageUrl = await uploadImage(image, imageName, uploadPath);
      const imageUrlMapping = { raw: imageUrl };
      data['imageUrl'] = imageUrlMapping;
    }

    newList.set(data);

    return newList.get();
  };
}

export default ListsAPI;
