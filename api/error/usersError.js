class UsersError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'users/' + code;
  }
}

export default UsersError;
