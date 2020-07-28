export default class BaseEntity {
  constructor (emails) {
    this.emails = emails;
  }

  static get id () {
    return '';
  }

  static get name () {
    return '';
  }

  static get actions () {
    return [];
  }

  static get parsers () {
    return [];
  }

  static get labels () {
    const labels = [];

    // access parsers property in child class
    // we need to avoid calling the class name because it will return empty
    const parsers = this.constructor.parsers;

    parsers.forEach((ParserClass) => {
      labels.push(ParserClass.label);
    });

    return labels;
  }

  static actionsForLabels (actions) {
    const actionsForLabels = {};

    const labels = this.constructor.labels;

    labels.forEach((label) => {
      actionsForLabels[label] = actions;
    });

    return actionsForLabels;
  }
}
