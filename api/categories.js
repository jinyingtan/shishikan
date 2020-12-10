import { db } from '@utils/firebase';
import CategoriesError from './error/categoriesError';

const categoriesCollection = db.collection('categories');

class CategoriesAPI {
  get = async (id) => {
    return categoriesCollection.doc(id).get();
  };
}

export default CategoriesAPI;
