class CategoriesError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'categories/' + code;
  }
}

export default CategoriesError;
