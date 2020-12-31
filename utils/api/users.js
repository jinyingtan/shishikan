import { db } from '@utils/firebase';
import UsersError from './error/usersError';

const usersCollection = db.collection('users');

class UsersAPI {
  get = async (id) => {
    return usersCollection.doc(id).get();
  };
}

export default UsersAPI;
