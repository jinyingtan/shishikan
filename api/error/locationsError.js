class LocationsError extends Error {
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 'locations/' + code;
  }
}

export default LocationsError;
