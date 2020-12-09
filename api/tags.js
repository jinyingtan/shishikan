import { db, firebase } from '@utils/firebase';
import TagsError from './error/tagsError';

const tagsCollection = db.collection('tags');

class TagsAPI {
  create = async (name) => {
    const snapshot = await this.getByName(name);
    if (snapshot !== null) {
      throw new TagsError('duplicated-tag-name', `tag of ${name} already exists`);
    }

    const newTag = tagsCollection.doc();
    const data = {
      id: newTag.id,
      name,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    newTag.set(data);

    return newTag.get();
  };

  getById = async (id) => {
    return tagsCollection.doc(id).get();
  };

  getByName = async (name) => {
    const snapshot = tagsCollection.where('name', '==', name).get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0];
  };
}

export default TagsAPI;
