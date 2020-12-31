import { db } from '@utils/firebase';
import CategoriesError from './error/categoriesError';

const categoriesCollection = db.collection('categories');

class CategoriesAPI {
  get = async (id) => {
    return categoriesCollection.doc(id).get();
  };

  getAll = async () => {
    const categories = await categoriesCollection.get();
    return categories.docs;
  };
}

export default CategoriesAPI;
