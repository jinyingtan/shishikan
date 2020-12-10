import { v4 as uuidv4 } from 'uuid';
import { db, firebaseAuth, firebase } from '@utils/firebase';
import api from '@api';
import { LIST_VISIBILITY } from '@constants/lists';
import { FOOD_VERDICT } from '@constants/food';
import { isValidListVisibility } from '@constants/lists';
import { isValidFoodVerdict } from '@constants/food';
import { getSharedCategoryInfos } from './common/categories';
import { getOrCreateSharedTagInfos } from './common/tags';
import { getLocationInfos } from './common/locations';
import { isValidCoverImageAndImages, uploadImage, uploadImagesWithCoverImage } from './common/images';
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
        `visibility only takes values of ${Object.values(LIST_VISIBILITY)}`
      );
    }

    const userSnapshot = await api.users.get(userId);
    if (!userSnapshot.exists) {
      throw new ListsError('invalid-user', 'user data does not exists');
    }
    const userInfo = userSnapshot.data();
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
      const imageName = `${newList.id}_${Date.now()}_${uuidv4()}`;
      const imageUrl = await uploadImage(image, imageName, uploadPath);
      data['imageUrl'] = imageUrl;
    }

    await newList.set(data);
    return newList.get();
  };

  getList = async (id) => {
    return listsCollection.doc(id).get();
  };

  addFoodItem = async (
    listId,
    name,
    description,
    categoryIds,
    tagNames,
    price,
    address,
    verdict = FOOD_VERDICT.TO_TRY,
    coverImage = null,
    images = []
  ) => {
    if (!isValidFoodVerdict(verdict)) {
      throw new ListsError('invalid-verdict', `verdict field only takes values of ${Object.values(FOOD_VERDICT)}`);
    }
    const hasImages = coverImage !== null && images.length > 0;
    if (hasImages) {
      const [
        hasValidCoverImageAndImagesError,
        coverImageAndImagesErrorCode,
        coverImageAndImagesErrorMessage,
      ] = isValidCoverImageAndImages(coverImage, images);
      if (hasValidCoverImageAndImagesError) {
        throw new ListsError(coverImageAndImagesErrorCode, coverImageAndImagesErrorMessage);
      }
    }

    const currentUser = firebaseAuth.currentUser;
    if (currentUser === null) {
      throw new ListsError('invalid-user', 'current user is null');
    }
    const userId = currentUser.uid;
    const userSnapshot = await api.users.get(userId);
    if (!userSnapshot.exists) {
      throw new ListsError('invalid-user', 'user data does not exists');
    }
    const userInfo = userSnapshot.data();
    const userData = {
      id: userInfo.id,
      name: userInfo.username,
      profileImageUrl: userInfo.profileImageUrl,
    };

    const listSnapshot = await this.getList(listId);
    if (!listSnapshot.exists) {
      throw new ListError('invalid-list', 'list does not exist');
    }
    if (listSnapshot.data().user.id !== userId) {
      throw new ListError('invalid-list', 'list does not belong to the user');
    }

    const [categoryData, tagData, addressData] = await Promise.all([
      getSharedCategoryInfos(categoryIds),
      getOrCreateSharedTagInfos(tagNames),
      getLocationInfos([address]),
    ]);

    const newFoodItem = await listsCollection.doc(listId).collection('food').doc();
    const timeNow = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      id: newFoodItem.id,
      name,
      description,
      categories: categoryData,
      tags: tagData,
      price,
      verdict,
      address: addressData[0],
      user: userData,
      createdAt: timeNow,
      updatedAt: timeNow,
    };

    if (hasImages) {
      const uploadPath = `lists/${listId}/food/${newFoodItem.id}/`;
      const imageNames = [];
      for (const image of images) {
        imageNames.push(`${newFoodItem.id}_${Date.now()}_${uuidv4()}`);
      }
      const imageUrls = await uploadImagesWithCoverImage(coverImage, images, imageNames, uploadPath);
      if (imageUrls === null) {
        throw new ListsError('upload-image-failed', 'failed to upload images');
      }
      console.log(imageUrls);
      data['imageUrls'] = imageUrls;
      data['coverImageUrl'] = imageUrls[0];
    }

    await newFoodItem.set(data);
    return newFoodItem.get();
  };
}

export default ListsAPI;
