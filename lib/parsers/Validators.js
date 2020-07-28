export default class Validators {
  static isEmptyString (value) {
    return String(value).trim() === '';
  }
}
