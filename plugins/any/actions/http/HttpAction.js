import BaseAction from '../../../../lib/actions';
import Fetch from '../../../../lib/http';
import { endpoint } from './Constants';

export default class HttpAction extends BaseAction {
  constructor({ email, config, Http = Fetch }) {
    super({ email, config });

    this.endpoint = endpoint;
    this.http = new Http({ endpoint, config });
  }

  run() {
    console.log('Executing HTTP Action');

    console.log('Sending Email', this.email.id);

    const element = this.email.element;
    const message = this.email.message;
    const info = this.email.info;

    const date = info.date.formatter;
    const ts = Date.now();

    const payload = {
      id: message.id,
      label: element.label.raw,
      info,
      date: {
        formatted: date.format('YYYY-MM-DD'), // iso8601
        time: date.format('HH:mm'),
        message: message.date
      },
      ts
    };

    this.http.payload = payload;

    // uncomment this to send data to endpoint
    // this.http.postJSON();
  }
}
