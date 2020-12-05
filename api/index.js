import AuthAPI from './auth';

class API {
  auth = new AuthAPI();
}

const api = new API();

export default api;
