import AuthAPI from './auth';
import ListsAPI from './lists';
import UsersAPI from './users';
import CategoriesAPI from './categories';

class API {
  auth = new AuthAPI();
  lists = new ListsAPI();
  users = new UsersAPI();
  categories = new CategoriesAPI();
}

const api = new API();

export default api;
