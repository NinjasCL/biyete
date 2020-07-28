export default class QueryBuilder {
  constructor({ entities, config }) {
    this._entities = entities;
    this._elements = {};
    this._query = null;
    this._labels = [];
    this._queries = [];

    this.config = config;
    this.init();
  }

  init() {
    this._entities.forEach((entity) => {
      entity.parsers.forEach((ParserClass, index) => {
        const label = ParserClass.labelForQuery(ParserClass.label);

        if (label) {
          const element = {
            name: index,
            entity,
            parser: ParserClass,
            label
          };

          this._elements[label.key] = element;
          this._elements[label.raw] = element;
          this._elements[label.formatted] = element;
          this._elements[label.query] = element;

          this._labels.push(label.query);
        }
      });
    });

    this.build();
  }

  /**
   * Will create a Query for Gmail
   * example: in:unread (label:my-label1 | label:my-label2)
   * @returns {Object} this;
   */
  build() {
    let query = 'in:unread (';
    this.labels.forEach((label, index) => {
      const element = this.elementForLabel({ label });
      query += `label:${element.label.query}`;
      // for making individual queries
      this.queries.push(`in:unread (label:${element.label.query})`);
      if (index < this.labels.length - 1) {
        query += ' | ';
      }
    });

    query = query.trim() + ')';

    this._query = query;

    return this;
  }

  get labels() {
    if (!this._labels) {
      this._labels = [];
      this.init();
    }
    return this._labels;
  }

  get query() {
    if (!this._query) {
      this.init();
    }
    return this._query;
  }

  get queries() {
    if (!this._queries) {
      this._queries = [];
      this.init();
    }

    return this._queries;
  }

  get elements() {
    if (!this._elements) {
      this.init();
    }
    return this._elements;
  }

  get entities() {
    return this._entities;
  }

  get data() {
    return {
      elements: this.elements,
      labels: this.labels,
      query: this.query,
      entities: this.entities
    };
  }

  get json() {
    return JSON.stringify(this.data);
  }

  elementForLabel({ label }) {
    const key = String(label.name || label).toLowerCase();
    console.log('Getting Element For Label', key);
    const element = this._elements[key];
    if (element) {
      console.log('Element found', element);
    }
    return element;
  }

  elementForLabels({ labels }) {
    // One email can have multiple labels
    // return the first element that have a known label
    let element = null;
    for (const label of labels) {
      element = this.elementForLabel({ label });
      if (element) {
        console.log('Element Found', { element, label: label.name });
        break;
      }
    }

    return element;
  }

  parserForLabels({ labels }) {
    const element = this.elementForLabels({ labels });
    return element.parser;
  }
}
