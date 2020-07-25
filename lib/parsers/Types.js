/**
 * Defines the available operation types.
 * normally "expense" (money out) and "deposit" (money in).
 * additional "alert" could be to notify an incomming payment
 * but that is not paid yet.
 */
export default class Types {
  static get expense () {
    return 'expense';
  }

  static get deposit () {
    return 'deposit';
  }

  static get alert () {
    return 'alert';
  }

  static get other () {
    return 'other';
  }
}
