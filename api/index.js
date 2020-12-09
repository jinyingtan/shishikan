import AuthAPI from './auth';
import ListsAPI from './lists';
import UsersAPI from './users';

class API {
  auth = new AuthAPI();
  lists = new ListsAPI();
  users = new UsersAPI();
}

const api = new API();

export default api;
