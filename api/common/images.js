import * as path from 'path';
import { firebaseStorage } from '@utils/firebase';
import { ALL_TEXT, ALL } from '@constants/firebase';
import ImagesError from '../error/imagesError';

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
    if (typeof image === 'string') {
      continue;
    }

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
    if (typeof image === 'string') {
      continue;
    }

    if (image === null) {
      return [true, 'invalid-image', 'one or more of the images provided are null'];
    }
  }

  const isCoverImageIncluded = images.find((image) => {
    if (typeof coverImage === 'string') {
      return typeof image === 'string' && coverImage === image;
    } else {
      return image != null && coverImage != null && coverImage.name === image.name;
    }
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
    throw new ImagesError('invalid-image-info', 'image names should the same length as the images provided');
  }

  const imagePromises = [];
  for (let i = 0; i < images.length; i++) {
    const imagePromise = uploadImage(images[i], imageNames[i], pathToUpload);
    imagePromises.push(imagePromise);
  }

  return Promise.all(imagePromises);
};

export const uploadNewImagesWithCoverImage = async (coverImage, images, imageNames, pathToUpload) => {
  if (images.length !== imageNames.length) {
    throw new ImagesError('invalid-image-info', 'image names should the same length as the images provided');
  }
  const coverImageIndex = images.findIndex((image) => coverImage !== null && image.name === coverImage.name);
  if (coverImageIndex === -1) {
    throw new ImagesError('invalid-cover-image', 'cover image is not included in the list of images');
  }

  const imageUrls = await uploadImages(images, imageNames, pathToUpload);
  const coverImageUrl = imageUrls.splice(coverImageIndex, 1);
  if (coverImageUrl.length < 1) {
    throw new ImagesError('invalid-cover-image', 'cover image could not be found in the list of uploaded images');
  }
  imageUrls.unshift(coverImageUrl[0]); // Shift cover image to the front;

  return imageUrls;
};

export const uploadUpdatedImagesWithCoverImage = async (coverImage, images, imageInfos, pathToUpload) => {
  if (images.length !== imageInfos.length) {
    throw new ImagesError('invalid-image-info', 'image info should the same length as the images provided');
  }
  const coverImageIndex = images.findIndex((image) => {
    if (typeof coverImage === 'string') {
      return typeof image === 'string' && image === coverImage;
    } else {
      return coverImage !== null && typeof image !== 'string' && image.name === coverImage.name;
    }
  });
  if (coverImageIndex === -1) {
    throw new ImagesError('invalid-cover-image', 'cover image is not included in the list of images');
  }

  const unusedImageNames = await getUnusedImageNames(images, pathToUpload);
  await deleteImages(unusedImageNames, pathToUpload);

  const imageUrlPromises = [];
  for (let i = 0; i < images.length; i++) {
    if (typeof images[i] === 'string') {
      // Existing Image
      imageUrlPromises.push(Promise.resolve(imageInfos[i]));
    } else {
      // New Image
      imageUrlPromises.push(uploadImage(images[i], imageInfos[i], pathToUpload));
    }
  }
  const imageUrls = await Promise.all(imageUrlPromises);
  const isSomeImageUrlsInvalid = imageUrls.some((imageUrl) => imageUrl === null);
  if (isSomeImageUrlsInvalid) {
    throw new ImagesError('invalid-images', 'failed to upload some of the images');
  }

  const coverImageUrl = imageUrls.splice(coverImageIndex, 1);
  if (coverImageUrl.length < 1) {
    throw new ImagesError('invalid-cover-image', 'cover image could not be found in the list of uploaded images');
  }
  imageUrls.unshift(coverImageUrl[0]); // Shift cover image to the front;

  return imageUrls;
};

export const deleteImage = async (imageNameWithExtension, pathToImage) => {
  const finalPathToImage = getPath(pathToImage);

  const storageRef = firebaseStorage.ref();
  const imageRef = storageRef.child(`${finalPathToImage}${imageNameWithExtension}`);
  imageRef.delete();
};

export const deleteImages = async (imageNamesWithExtension, pathToImages) => {
  const promises = imageNamesWithExtension.map((imageNameWithExtension) => {
    return deleteImage(imageNameWithExtension, pathToImages);
  });

  await Promise.all(promises);
};

export const getUnusedImageNames = async (imagesToUpload, bucketPath) => {
  const storageRef = firebaseStorage.ref();
  const imageRefs = storageRef.child(bucketPath);

  const storageImageRefs = await imageRefs.listAll();
  const storageImageUrlPromises = storageImageRefs.items.map((imageRef) => {
    return imageRef.getDownloadURL();
  });
  const storageImageUrls = await Promise.all(storageImageUrlPromises);

  if (storageImageUrls.length === 0) {
    return []; 
  }

  // Get only raw image name to url
  const storageImageNameAndUrls = [];
  for (let i = 0; i < storageImageUrls.length; i++) {
    const containsVariation = ALL.some((variation) => storageImageRefs.items[i].name.includes(variation));
    if (containsVariation) {
      continue;
    }

    const imageNameAndUrl = { name: storageImageRefs.items[i].name, url: storageImageUrls[i] };
    storageImageNameAndUrls.push(imageNameAndUrl);
  }

  const existingImageInStorageIndexes = [];
  for (const imageToUpload of imagesToUpload) {
    if (typeof imageToUpload === 'string') {
      const existingImageInStorageIndex = storageImageNameAndUrls.findIndex((storageImageNameAndUrl) => {
        return storageImageNameAndUrl.url === imageToUpload;
      });
      if (existingImageInStorageIndex === -1) {
        throw new ImagesError('invalid-existing-images', 'some of the existing image url does not exist');
      }

      existingImageInStorageIndexes.push(existingImageInStorageIndex);
    }
  }

  const unusedImageNames = [];
  for (let i = 0; i < storageImageNameAndUrls.length; i++) {
    if (!existingImageInStorageIndexes.includes(i)) {
      unusedImageNames.push(storageImageNameAndUrls[i].name);
    }
  }

  return unusedImageNames;
};

export const getEmptyImageMappings = () => {
  const imageUrlMapping = { raw: '' };
  for (const imageSizeText of ALL_TEXT) {
    imageUrlMapping[imageSizeText] = '';
  }

  return imageUrlMapping;
}
