import api from '@api';

export const getAllCategoryInfos = async (categoryIds) => {
  const categoryPromises = categoryIds.map((categoryId) => {
    return api.categories.get(categoryId);
  });

  const categorySnapshots = await Promise.all(categoryPromises);

  const categoryInfos = [];
  for (const categorySnapshot of categorySnapshots) {
    if (categorySnapshot.exists) {
      categoryInfos.push(categorySnapshot.data());
    }
  }
  return categoryInfos;
};

export const getSharedCategoryInfos = async (categoryIds) => {
  const categoryInfos = await getAllCategoryInfos(categoryIds);

  const sharedCategoryInfos = [];
  for (const categoryInfo of categoryInfos) {
    const sharedInfo = {
      id: categoryInfo.id,
      name: categoryInfo.name,
    };
    sharedCategoryInfos.push(sharedInfo);
  }
  return sharedCategoryInfos;
};

export const getUpdatedCategoryInfos = async (currentCategories, updatedCategoryIds) => {
  const categoryInfos = [];
  const newCategoryIdsToQuery = [];

  for (const id of updatedCategoryIds) {
    const categoryInfo = currentCategories.find((category) => category.id === id);
    if (categoryInfo === undefined) {
      newCategoryIdsToQuery.push(id);
    } else {
      categoryInfos.push(categoryInfo);
    }
  }

  const newCategoryInfos = await getSharedCategoryInfos(newCategoryIdsToQuery);
  return [...categoryInfos, ...newCategoryInfos];
};
