class ListsError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'lists/' + code;
  }
}

export default ListsError;
