class ImagesError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'images/' + code;
  }
}

export default ImagesError;
