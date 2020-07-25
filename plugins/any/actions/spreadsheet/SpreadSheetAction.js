import BaseAction from '../../../../lib/actions';
import URL from './Constants';
/**
 * Save email info to an spreadsheeet
 */
export default class SpreadSheetAction extends BaseAction {
  constructor({ email, config }) {
    super({ email, config });

    // SpreadsheetApp is defined in Google Scripts API
    // https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app
    // TODO: Find a way to mock this
    this.api = SpreadsheetApp;

    this.file = this.api.openByUrl(URL);
    this.sheet = this.file.getActiveSheet();
    this.email = email;
    this.canSave = true;

    if (!this.file) {
      console.log('No spreadsheet found at', URL);
      this.canSave = false;
    }
  }

  run() {
    console.log('Executing SpreadSheet Action');

    if (!this.canSave) {
      console.log('Could not save');
      return;
    }

    console.log('Saving Email', this.email.id);

    const element = this.email.element;
    const message = this.email.message;
    const info = this.email.info;

    const date = info.date.formatter;
    const ts = Date.now();

    // id|email|amount|currency|context|account|day|hour|type|label|entity|comment|created at|sent at|json
    const columns = [
      message.id,
      message.from,
      String(info.amount),
      info.currency.code,
      info.context,
      info.account,
      date.format('YYYY-MM-DD'), // iso8601
      date.format('HH:mm'),
      info.type,
      element.label.raw,
      info.entity,
      info.comment,
      info.createdAt,
      message.date,
      JSON.stringify({
        id: message.id,
        label: element.label.raw,
        info,
        date: message.date,
        ts
      }),
      ts
    ];

    console.log('Saving data', columns);
    this.sheet.appendRow(columns);
  }
}
