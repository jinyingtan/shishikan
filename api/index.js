import AuthAPI from './auth';
import ListsAPI from './lists';
import UsersAPI from './users';
import CategoriesAPI from './categories';
import TagsAPI from './tags';

class API {
  auth = new AuthAPI();
  lists = new ListsAPI();
  users = new UsersAPI();
  categories = new CategoriesAPI();
  tags = new TagsAPI();
}

const api = new API();

export default api;
