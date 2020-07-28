import Types from './Types';
import Validators from './Validators';
import Formatters from './Formatters';

/**
 * Defines the base class for parsers
 */
export default class BaseParser {
  constructor({
    email,
    config,
    name,
    entity,
    label,
    type,
    currency,
    version,
    createdAt = null
  }) {
    this.email = email;
    this.config = config;
    this.validators = Validators;
    this.types = Types;
    this.formatters = Formatters;

    this.type = type;
    this.entity = entity;
    this.name = name;
    this.label = label;
    this.currency = currency;
    this.version = version;

    this._result = {
      amount: 0, // The amount inside the email content.
      context: '', // Normally the store, the person, or similar info to give context to the transaction.
      account: '', // Associated card number, user account or any other info from wich the transaction took place.
      date: {
        formatter: {}, // DayJS object or similar date formatter
        raw: '' // Raw date string
      },
      name: this.name, // Parser Name.
      type: this.type, // Parser type expense, deposit, alert, other.
      label: this.label, // Parser label.
      entity: this.entity, // Which bank or entity processed the email.
      currency: this.currency, // Currency associated with the ammount.
      meta: {}, // Any other info not fit in the previous properties.
      comment: '', // Additional comment.
      createdAt: createdAt || new Date(), // When this was processed.
      version: this.version,
      parsed: false // tells if the parse was successful
    };
  }

  /**
   * @return {string} is this an expense or a deposit?
   */
  static get type() {
    return Types.expense;
  }

  /**
   * @return {string} name of the parser
   */
  static get name() {
    return 'My Custom Parser';
  }

  /**
   * Label associated with the email
   * must follow the format {type}:{countrycode}-{entity}:{context}
   * override in child
   * @return {string} the label associated with the email
   */
  static get label() {
    return '{type}:{countrycode}-{entity}:{context}';
  }

  static get labels() {
    return {};
  }

  static labelForQuery(label) {
    // label query format

    console.log('Label For Query', { label });

    const prefix = 'biyete';

    // Gmail in search needs + signs to differentiate spaces
    const formatted = label.replace(' ', '+').toLowerCase();

    // Example: biyete/expense:cl-bancoestado:purchase-notifications
    const key = prefix + '/' + formatted;

    // Example: biyete-expense:cl-bancoestado:purchase-notifications
    const query = prefix + '-' + formatted;

    return { raw: label, formatted, key, query };
  }

  /**
   * @return {string} wich company is related to this parser
   */
  static get entity() {
    return 'My Custom Company';
  }

  /**
   * Parser version.
   * Try following SemVer or similar if possible.
   * @return {string} the current parser version
   */
  static get version() {
    return '0.0.1';
  }

  static get types() {
    return Types;
  }

  static get validators() {
    return Validators;
  }

  static get formatters() {
    return Formatters;
  }

  static getGroups(regex, text) {
    const matches = text.matchAll(regex);
    // convert from iterable object to simple array
    let groups = [];
    for (const match of matches) {
      groups = [...groups, ...match];
    }
    return groups;
  }

  // Instance Methods
  get result() {
    return this._result;
  }

  setResult(data) {
    this._result = { ...this._result, ...data };
    console.log('Parser Result', this._result);
    return this.result;
  }

  groups(regex, text) {
    return BaseParser.getGroups(regex, text);
  }

  // Implement in Child Class
  parse() {
    console.log('Init Parsing');
    return {};
  }
}
