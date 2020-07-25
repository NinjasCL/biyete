import methods from './Methods';

// https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app
export default class Fetch {
  constructor({
    endpoint,
    config,
    options = {},
    payload = {},
    api = UrlFetchApp,
    muteHttpExceptions = true
  }) {
    this.api = api;
    this.endpoint = endpoint;
    this.config = config;
    this.options = options || {};
    this.payload = payload || {};
    this.muteHttpExceptions = muteHttpExceptions || true;
  }

  fetch() {
    if (!this.options.method) {
      this.options.method = methods.get;
    }

    this.options.muteHttpExceptions = this.muteHttpExceptions;
    console.log('Fetching HTTP', {
      endpoint: this.endpoint,
      options: this.options
    });
    // https://developers.google.com/apps-script/reference/url-fetch/http-response
    const response = this.api.fetch(this.endpoint, this.options);
    console.log({
      status: response.getResponseCode(),
      content: response.getContentText()
    });
    return response;
  }

  fetchJSON() {
    this.options.payload = JSON.stringify(this.payload);
    this.options.contentType = 'application/json';
    return this.fetch();
  }

  post() {
    this.options.method = methods.post;
    return this.fetch();
  }

  postJSON() {
    this.options.method = methods.post;
    return this.fetchJSON();
  }
}
