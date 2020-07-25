import BaseBancoEstadoParser from './BaseBancoEstadoParser';

export default class BancoEstadoExpensePurchaseParser extends BaseBancoEstadoParser {
  constructor({ email, config }) {
    super({
      email,
      config,
      type: BancoEstadoExpensePurchaseParser.type,
      name: BancoEstadoExpensePurchaseParser.name,
      label: BancoEstadoExpensePurchaseParser.label,
      version: BancoEstadoExpensePurchaseParser.version
    });
  }

  static get type() {
    return BaseBancoEstadoParser.types.expense;
  }

  static get name() {
    const entity = BaseBancoEstadoParser.entity;
    return `${entity} Purchase Notification Parser`;
  }

  static get label() {
    return BaseBancoEstadoParser.labels.purchase;
  }

  static get version() {
    return '1.0.0';
  }

  parse() {
    const email = this.email.message;

    console.log('Parsing Email', email.id, 'With', this.name);

    const body = email.body.toLowerCase();

    if (this.validators.isEmptyString(body)) {
      console.warn('Empty body, nothing to parse.');
      return this.result;
    }

    console.log('Body', email.body);

    const getAmount = () => {
      const regex = /se\s*ha\s*realizado\s*una\s*compra\s*por\s*\$\s*([\S]+)/gim;
      const groups = this.groups(regex, body);
      const value = this.formatters.numeric(groups[1]);
      console.log('Amount', value);
      return value;
    };

    const getContext = () => {
      const regex = /se\s*ha\s*realizado\s*una\s*compra\s*por\s*[$\w.]*\s*en\s*([\s\S]+)\s*asociado\s*a\s*su\s*tarjeta\s*terminada/gim;
      const groups = this.groups(regex, body);
      const value = this.formatters.string(groups[1]);
      console.log('Context', value);
      return value;
    };

    const getAccount = () => {
      const regex = /[\s\S]*tarjeta\s*terminada\s*en\s*([\s\S]+)\s*el/gim;
      const groups = this.groups(regex, body);
      const value = this.formatters.string(groups[1]);
      console.log('Account', value);
      return value;
    };

    const getDate = () => {
      const getDay = () => {
        const regex = /[\s\S]*el\s*dia\s*([\s\S]+)\s*a\s*las/gim;
        const groups = this.groups(regex, body);
        const value = this.formatters.string(groups[1]);
        console.log('Day', value);
        return value;
      };

      const getHour = () => {
        const regex = /[\s\S]*el\s*dia\s*[\s\S]+\s*a\s*las\s*([\S\s]+)hrs.*/gim;
        const groups = this.groups(regex, body);
        const value = this.formatters.string(groups[1]);
        console.log('Hour', value);
        return value;
      };

      const raw = getDay() + ' ' + getHour();
      // 27/06/2020 13:08
      const format = 'DD/MM/YYYY HH:mm';
      const formatter = this.formatters.date({ raw, format });
      return {
        raw,
        formatter
      };
    };

    return this.setResult({
      amount: getAmount(),
      context: getContext(),
      account: getAccount(),
      date: getDate(),
      parsed: true
    });
  }
}
