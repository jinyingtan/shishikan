import * as path from 'path';
import { firebaseStorage } from '@utils/firebase';
import { ALL_TEXT } from '@constants/firebase';

const getPath = (path) => {
  let finalPath = path;
  if (finalPath.substr(-1) !== '/') {
    finalPath += '/';
  }

  return path;
};

export const isValidImageExtensions = (images) => {
  const VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

  for (const image of images) {
    if (image === null) {
      return [true, 'invalid-image', 'one or more of the images provided are null'];
    }

    const imageExt = path.extname(image.name).toLowerCase();
    if (!VALID_EXTENSIONS.includes(imageExt)) {
      return [false, 'invalid-image-extension', `Only ${VALID_EXTENSIONS.join(', ')} are valid image extensions`];
    }
  }

  return [false, '', ''];
};

export const isValidCoverImageAndImages = (coverImage, images) => {
  if (coverImage !== null && images.length === 0) {
    return [true, 'invalid-cover-image', 'cover image is not provided within the list of images'];
  }
  if (coverImage === null && image.length > 0) {
    return [true, 'invalid-cover-image', 'cover image is not provided'];
  }

  for (const image of images) {
    if (image === null) {
      return [true, 'invalid-image', 'one or more of the images provided are null'];
    }
  }

  const isCoverImageIncluded = images.find((image) => {
    return image != null && coverImage != null && coverImage.name == image.name;
  });
  if (!isCoverImageIncluded) {
    return [true, 'invalid-cover-image', 'cover image is not provided within the list of images'];
  }

  return isValidImageExtensions(images);
};

export const uploadImage = async (image, imageName, pathToUpload) => {
  const finalPathToUpload = getPath(pathToUpload);

  const ext = path.extname(image.name);
  const storageRef = firebaseStorage.ref();
  const imageRef = storageRef.child(`${finalPathToUpload}${imageName}${ext}`);
  await imageRef.put(image);

  const rawImageUrl = await imageRef.getDownloadURL();
  const imageUrlMapping = { raw: rawImageUrl };
  for (const imageSizeText of ALL_TEXT) {
    imageUrlMapping[imageSizeText] = '';
  }

  return imageUrlMapping;
};

export const uploadImages = async (images, imageNames, pathToUpload) => {
  if (images.length !== imageNames.length) {
    // TODO: Find a better way
    return null;
  }

  const imagePromises = [];
  for (let i = 0; i < images.length; i++) {
    const imagePromise = uploadImage(images[i], imageNames[i], pathToUpload);
    imagePromises.push(imagePromise);
  }

  return Promise.all(imagePromises);
};

export const uploadImagesWithCoverImage = async (coverImage, images, imageNames, pathToUpload) => {
  const coverImageIndex = images.findIndex((image) => coverImage !== null && image.name === coverImage.name);
  if (coverImageIndex === -1) {
    // TODO: Find a better way
    return null;
  }

  const imageUrls = await uploadImages(images, imageNames, pathToUpload);
  if (imageUrls === null) {
    // TODO: Find a better way
    return null;
  }
  const coverImageUrl = imageUrls.splice(coverImageIndex, 1);
  if (coverImageUrl.length < 1) {
    // TODO: Find a better way
    return null;
  }
  imageUrls.unshift(coverImageUrl[0]); // Shift cover image to the front;

  return imageUrls;
};
