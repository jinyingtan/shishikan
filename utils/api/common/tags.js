import api from '@api';

export const getOrCreateTag = async (tagNames) => {
  const tagPromises = tagNames.map((tagName) => {
    return api.tags.getByName(tagName);
  });
  const tagSnapshots = await Promise.all(tagPromises);

  const tagInfos = [];
  for (let i = 0; i < tagSnapshots.length; i++) {
    let tagInfo = {};

    if (tagSnapshots[i] === null) {
      const newTagSnapshot = await api.tags.create(tagNames[i]);
      tagInfo = newTagSnapshot.data();
    } else {
      tagInfo = tagSnapshots[i].data();
    }

    tagInfos.push(tagInfo);
  }

  return tagInfos;
};

export const getOrCreateSharedTagInfos = async (tagNames) => {
  const tagInfos = await getOrCreateTag(tagNames);

  const sharedTagInfos = [];
  for (const tagInfo of tagInfos) {
    const sharedInfo = {
      id: tagInfo.id,
      name: tagInfo.name,
    };
    sharedTagInfos.push(sharedInfo);
  }
  return sharedTagInfos;
};

export const getUpdatedTagInfos = async (currentTags, updatedTagNames) => {
  const tagInfos = [];
  const newTagNamesToQuery = [];

  for (const name of updatedTagNames) {
    const tagInfo = currentTags.find((tag) => tag.name === name);
    if (tagInfo === undefined) {
      newTagNamesToQuery.push(name);
    } else {
      tagInfos.push(tagInfo);
    }
  }

  const newTagInfos = await getOrCreateSharedTagInfos(newTagNamesToQuery);
  return [...tagInfos, ...newTagInfos];
};
