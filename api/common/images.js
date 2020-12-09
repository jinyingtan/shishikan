import { firebaseStorage } from '@utils/firebase';

const getPath = (path) => {
  let finalPath = path;
  if (finalPath.substr(-1) !== '/') {
    finalPath += '/';
  }

  return path;
};

export const uploadImage = async (image, imageName, pathToUpload) => {
  const path = getPath(pathToUpload);

  const storageRef = firebaseStorage.ref();
  const imageRef = storageRef.child(`${path}${imageName}`);
  await imageRef.put(image);

  return imageRef.getDownloadURL();
};
