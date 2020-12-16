class TagsError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'tags/' + code;
  }
}

export default TagsError;
