import { db } from '@utils/firebase';
import CategoriesError from './error/categoriesError';

const categoriesCollection = db.collection('categories');

class CategoriesAPI {
  get = async (id) => {
    const snapshot = categoriesCollection.doc(id).get();

    if (!snapshot.exists) {
      throw new CategoriesError('invalid-category-id', 'category does not exist');
    }

    return snapshot;
  };
}

export default CategoriesAPI;
