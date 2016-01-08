export default class User {
  constructor(attributes) {
    Object.keys(attributes)
          .forEach( key => this[key] = attributes[key]);
  }
}
