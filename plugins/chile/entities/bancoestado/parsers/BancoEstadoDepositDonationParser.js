import BaseBancoEstadoParser from './BaseBancoEstadoParser';

export default class BancoEstadoDepositDonationParser extends BaseBancoEstadoParser {
  constructor({ email, config }) {
    super({
      email,
      config,
      type: BancoEstadoDepositDonationParser.type,
      name: BancoEstadoDepositDonationParser.name,
      label: BancoEstadoDepositDonationParser.label,
      version: BancoEstadoDepositDonationParser.version
    });
  }

  static get type() {
    return BaseBancoEstadoParser.types.deposit;
  }

  static get name() {
    const entity = BaseBancoEstadoParser.entity;
    return `${entity} Donation Notification Parser`;
  }

  static get label() {
    return BaseBancoEstadoParser.labels.donation;
  }

  static get version() {
    return '1.0.0';
  }

  parse() {
    const email = this.email.message;

    console.log('Parsing Email', email.id, 'With', this.name, this.version);

    const body = email.body.toLowerCase();

    console.log('Body', email.body);

    if (this.validators.isEmptyString(body)) {
      console.warn('Empty body, nothing to parse.');
      return this.result;
    }

    const getDate = () => {
      const regex = /Te informamos que hoy[ *]*([\w ]+)/gim;
      const groups = this.groups(regex, body);
      const value = this.formatters.string(groups[1]);

      // 13 de julio 2020
      const data = value.split(' ');

      // TODO: Test parsing numbers
      if (data[2]) {
        const months = {
          enero: '01',
          febrero: '02',
          marzo: '03',
          abril: '04',
          mayo: '05',
          junio: '06',
          julio: '07',
          agosto: '08',
          septiembre: '09',
          octubre: '10',
          noviembre: '11',
          diciembre: '12'
        };

        const dayNumber = Number(data[0]);
        const day = dayNumber < 10 ? '0' + dayNumber : dayNumber;

        const month = months[data[2].toLowerCase().trim()];
        const year = data[3];

        const date = day + '/' + month + '/' + year;
        const format = 'DD/MM/YYYY';

        return {
          formatter: this.formatters.date({ raw: date, format }),
          raw: value
        };
      }

      console.warn('Could not format date', value);
      return {
        formatter: this.formatters.date({ raw: value }),
        raw: value
      };
    };

    const getAmount = () => {
      const regex = /recibida:[ *$]*([\w. ]+)/gim;
      const groups = this.groups(regex, body);
      return this.formatters.numeric(groups[1]);
    };

    const getName = () => {
      const regex = /Nombre[\r\n:]*([\w ]+)/gim;
      const groups = this.groups(regex, body);
      return this.formatters.string(groups[1]);
    };

    const getId = () => {
      const regex = /RUT[\r\n:]*([\w ]+)/gim;
      const groups = this.groups(regex, body);
      return this.formatters.string(groups[1]);
    };

    const getContext = () => {
      const regex = /Banco[\r\n:]*([\w ]+)/gim;
      const groups = this.groups(regex, body);
      return this.formatters.string(groups[1]);
    };

    const result = {
      date: getDate(),
      amount: getAmount(),
      comment: getName(),
      account: getId(),
      context: getContext(),
      parsed: true
    };

    return this.setResult(result);
  }
}
