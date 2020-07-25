import dayjs from './vendor/dayjs';

export default class Formatters {
  static numeric(value, separator = '.') {
    // replace separator to have a clean number to cast properly
    return Number(Formatters.string(value).replace(separator, ''));
  }

  static string(value) {
    return String(value).trim();
  }

  static date({ raw, format = '', strict = false } = {}) {
    // see https://github.com/iamkun/dayjs
    console.log('Formatting Date', { raw, format });
    return dayjs(Formatters.string(raw), format, strict);
  }
}
