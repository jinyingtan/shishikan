import { v4 as uuidv4 } from 'uuid';
import { db, firebase, firebaseAuth } from '@utils/firebase';
import { LIST_VISIBILITY } from '@constants/lists';
import { FOOD_VERDICT } from '@constants/food';
import { isValidListVisibility } from '@constants/lists';
import { isValidFoodVerdict } from '@constants/food';
import { getSharedUserData, getCurrentUser } from './common/users';
import { getSharedCategoryInfos, getUpdatedCategoryInfos } from './common/categories';
import { getOrCreateSharedTagInfos, getUpdatedTagInfos } from './common/tags';
import { getLocationInfos, getUpdatedLocations } from './common/locations';
import {
  isValidCoverImageAndImages,
  uploadImage,
  uploadNewImagesWithCoverImage,
  uploadUpdatedImagesWithCoverImage,
  getUnusedImageNames,
  deleteImages,
} from './common/images';
import ListsError from './error/listsError';
import UsersError from './error/usersError';

const listsCollection = db.collection('lists');

class ListsAPI {
  createList = async (name, description = '', image = null, visibility = LIST_VISIBILITY.PUBLIC) => {
    if (!isValidListVisibility(visibility)) {
      throw new ListsError(
        'invalid-visibility-value',
        `visibility only takes values of ${Object.values(LIST_VISIBILITY)}`
      );
    }

    const userData = await getSharedUserData();

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

  getLists = async (id) => {
    const user = await getCurrentUser();
    if (!user) {
      throw new ListsError('invalid-user', `User does not exists`);
    }
    const lists = await listsCollection.where('user.id', '==', user.uid).get();
    return lists.docs;
  };

  updateList = async (id, name, description, image, visibility) => {
    if (!isValidListVisibility(visibility)) {
      throw new ListsError(
        'invalid-visibility-value',
        `visibility only takes values of ${Object.values(LIST_VISIBILITY)}`
      );
    }
    await this._validateListOwner(id);

    const data = {
      name,
      description,
      visibility,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const uploadPath = `lists/${id}/`;
    if (typeof image !== 'string' && image !== null) {
      const unusedImageNames = await getUnusedImageNames([image], uploadPath);
      await deleteImages(unusedImageNames, uploadPath);

      const imageName = `${id}_${Date.now()}_${uuidv4()}`;
      const imageUrl = await uploadImage(image, imageName, uploadPath);
      data['imageUrl'] = imageUrl;
    } else if (image === null) {
      const unusedImageNames = await getUnusedImageNames([], uploadPath);
      await deleteImages(unusedImageNames, uploadPath);
      data['imageUrl'] = firebase.firestore.FieldValue.delete();
    }

    const listRef = listsCollection.doc(id);
    await listRef.update(data);
    return listRef.get();
  };

  addFood = async (
    listId,
    name,
    description,
    categoryIds,
    tagNames,
    address,
    price = -1,
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

    const [userData, listSnapshot] = await Promise.all([getSharedUserData(), this.getList(listId)]);
    if (!listSnapshot.exists) {
      throw new ListsError('invalid-list', 'list does not exist');
    }
    if (listSnapshot.data().user.id !== userData.id) {
      throw new ListsError('invalid-list', 'list does not belong to the user');
    }

    const [categoryData, tagData, addressData] = await Promise.all([
      getSharedCategoryInfos(categoryIds),
      getOrCreateSharedTagInfos(tagNames),
      getLocationInfos([address]),
    ]);

    const newFoodItem = listsCollection.doc(listId).collection('food').doc();
    const timeNow = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      id: newFoodItem.id,
      name,
      description,
      categories: categoryData,
      tags: tagData,
      verdict,
      address: addressData[0],
      user: userData,
      createdAt: timeNow,
      updatedAt: timeNow,
    };
    if (price !== -1) {
      data['price'] = price;
    }

    if (hasImages) {
      const uploadPath = `lists/${listId}/food/${newFoodItem.id}/`;
      const imageNames = [];
      for (const image of images) {
        imageNames.push(`${newFoodItem.id}_${Date.now()}_${uuidv4()}`);
      }
      const imageUrls = await uploadNewImagesWithCoverImage(coverImage, images, imageNames, uploadPath);
      if (imageUrls === null) {
        throw new ListsError('upload-image-failed', 'failed to upload images');
      }

      data['imageUrls'] = imageUrls;
      data['coverImageUrl'] = imageUrls[0];
    }

    await newFoodItem.set(data);
    return newFoodItem.get();
  };

  getFood = async (listId, foodId) => {
    return listsCollection.doc(listId).collection('food').doc(foodId).get();
  };

  getFoods = async (listId) => {
    const foods = await listsCollection.doc(listId).collection('food').orderBy('createdAt').get();
    return foods.docs;
  };

  updateFood = async (
    foodId,
    listId,
    name,
    description,
    categoryIds,
    tagNames,
    address,
    price = -1,
    verdict = FOOD_VERDICT.TO_TRY,
    coverImage = null,
    images = []
  ) => {
    if (!isValidFoodVerdict(verdict)) {
      throw new ListsError('invalid-verdict', `verdict field only takes values of ${Object.values(FOOD_VERDICT)}`);
    }
    await this._validateListOwner(listId);
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

    const foodSnapshot = await this.getFood(listId, foodId);
    if (!foodSnapshot.exists) {
      throw new ListError('invalid-food', 'food data does not exists');
    }
    const food = foodSnapshot.data();
    const [updatedCategoryData, updatedTagData, updatedAddressData] = await Promise.all([
      getUpdatedCategoryInfos(food.categories, categoryIds),
      getUpdatedTagInfos(food.tags, tagNames),
      getUpdatedLocations([food.address], [address]),
    ]);

    const foodData = {
      name,
      description,
      categories: updatedCategoryData,
      tags: updatedTagData,
      verdict,
      address: updatedAddressData[0],
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    if (price !== -1) {
      foodData['price'] = price;
    }

    const uploadPath = `lists/${listId}/food/${foodId}/`;
    if (hasImages) {
      const currentFoodImages = food.imageUrls;
      const imageInfos = [];
      for (const image of images) {
        if (typeof image === 'string') {
          // Existing image
          const imageUrlMapping = currentFoodImages.find((currentFoodImage) => currentFoodImage.raw === image);
          if (imageUrlMapping === undefined) {
            throw new ListsError('invalid-image', 'existing image does not exists');
          }
          imageInfos.push(imageUrlMapping);
        } else {
          // New image
          imageInfos.push(`${foodId}_${Date.now()}_${uuidv4()}`);
        }
      }
      const imageUrls = await uploadUpdatedImagesWithCoverImage(coverImage, images, imageInfos, uploadPath);
      if (imageUrls === null) {
        throw new ListsError('upload-image-failed', 'failed to upload images');
      }

      foodData['imageUrls'] = imageUrls;
      foodData['coverImageUrl'] = imageUrls[0];
    } else if (coverImage === null && images.length === 0) {
      // Delete all images
      const unusedImageNames = await getUnusedImageNames([], uploadPath);
      await deleteImages(unusedImageNames, uploadPath);
      foodData['imageUrls'] = firebase.firestore.FieldValue.delete();
      foodData['coverImageUrl'] = firebase.firestore.FieldValue.delete();
    }

    const foodRef = listsCollection.doc(listId).collection('food').doc(foodId);
    await foodRef.update(foodData);
    return foodRef.get();
  };

  addReview = async (listId, foodId, description, verdict, price = -1, coverImage = null, images = []) => {
    if (!isValidFoodVerdict(verdict)) {
      throw new ListsError('invalid-verdict', `verdict field only takes values of ${Object.values(FOOD_VERDICT)}`);
    }
    if (verdict === FOOD_VERDICT.TO_TRY) {
      throw new ListsError('invalid-verdict', `review verdict cannot be FOOD_VERDICT.TO_TRY`);
    }
    await this._validateListOwner(listId);
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

    const userData = await getSharedUserData();

    const foodRef = listsCollection.doc(listId).collection('food').doc(foodId);
    const timeNow = firebase.firestore.FieldValue.serverTimestamp();
    const foodData = {
      verdict,
      updatedAt: timeNow,
    };
    if (price !== -1) {
      foodData['price'] = price;
    }
    if (hasImages) {
      const foodSnapshot = await this.getFood(listId, foodId);
      if (!foodSnapshot.exists) {
        throw new ListError('invalid-food', 'food data does not exists');
      }
      const currentFoodImages = foodSnapshot.data().imageUrls;

      const uploadPath = `lists/${listId}/food/${foodId}/`;
      const imageInfos = [];
      for (const image of images) {
        if (typeof image === 'string') {
          // Existing image
          const imageUrlMapping = currentFoodImages.find((currentFoodImage) => currentFoodImage.raw === image);
          if (imageUrlMapping === undefined) {
            throw new ListsError('invalid-image', 'existing image does not exists');
          }
          imageInfos.push(imageUrlMapping);
        } else {
          // New image
          imageInfos.push(`${foodId}_${Date.now()}_${uuidv4()}`);
        }
      }
      const imageUrls = await uploadUpdatedImagesWithCoverImage(coverImage, images, imageInfos, uploadPath);
      if (imageUrls === null) {
        throw new ListsError('upload-image-failed', 'failed to upload images');
      }

      foodData['imageUrls'] = imageUrls;
      foodData['coverImageUrl'] = imageUrls[0];
    }

    const newReview = listsCollection.doc(listId).collection('food').doc(foodId).collection('reviews').doc();
    const reviewData = {
      id: newReview.id,
      description,
      verdict,
      user: userData,
      createdAt: timeNow,
      updatedAt: timeNow,
    };

    await Promise.all([foodRef.update(foodData), newReview.set(reviewData)]);
    return newReview.get();
  };

  updateReview = async (reviewId, listId, foodId, description, verdict) => {
    if (!isValidFoodVerdict(verdict)) {
      throw new ListsError('invalid-verdict', `verdict field only takes values of ${Object.values(FOOD_VERDICT)}`);
    }
    if (verdict === FOOD_VERDICT.TO_TRY) {
      throw new ListsError('invalid-verdict', `review verdict cannot be FOOD_VERDICT.TO_TRY`);
    }
    await this._validateListOwner(listId);

    const foodRef = listsCollection.doc(listId).collection('food').doc(foodId);
    const timeNow = firebase.firestore.FieldValue.serverTimestamp();
    const foodData = {
      verdict,
      updatedAt: timeNow,
    };

    const reviewRef = listsCollection.doc(listId).collection('food').doc(foodId).collection('reviews').doc(reviewId);
    const reviewData = {
      description,
      verdict,
      updatedAt: timeNow,
    };

    await Promise.all([foodRef.update(foodData), reviewRef.update(reviewData)]);
    return reviewRef.get();
  };

  _validateListOwner = async (listId) => {
    const currentUser = firebaseAuth.currentUser;
    if (currentUser === null) {
      throw new UsersError('invalid-user', 'current user is null');
    }
    const userId = currentUser.uid;

    const listSnapshot = await this.getList(listId);
    if (!listSnapshot.exists) {
      throw new ListsError('invalid-list', 'list does not exist');
    }
    if (listSnapshot.data().user.id !== userId) {
      throw new ListsError('invalid-list', 'list does not belong to the user');
    }
  };
}

export default ListsAPI;
