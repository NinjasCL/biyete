import BaseBancoEstadoParser from './BaseBancoEstadoParser';

export default class BancoEstadoDepositTransferParser extends BaseBancoEstadoParser {
  constructor({ email, config }) {
    super({
      email,
      config,
      type: BancoEstadoDepositTransferParser.type,
      name: BancoEstadoDepositTransferParser.name,
      label: BancoEstadoDepositTransferParser.label,
      version: BancoEstadoDepositTransferParser.version
    });
  }

  static get type() {
    return BaseBancoEstadoParser.types.deposit;
  }

  static get name() {
    const entity = BaseBancoEstadoParser.entity;
    return `${entity} Transfer Notification Parser`;
  }

  static get label() {
    return BaseBancoEstadoParser.labels.transfer;
  }

  static get version() {
    return '1.0.0';
  }

  parse() {
    const email = this.email.message;

    console.log('Parsing Email', email, 'With', this.name);

    const body = email.body.toLowerCase();

    if (this.validators.isEmptyString(body)) {
      console.warn('Empty body, nothing to parse.');
      return this.result;
    }

    console.log('Body', email.body);

    const getDate = () => {
      const regex = /[[\s\S]*\(tef\)[\s\S]*te\s*informamos\s*que\s*hoy\s*\*([\s\S]+)\*,\s*has\s*recibido\s*una\s*transferencia/gim;
      const groups = this.groups(regex, body);
      const value = this.formatters.string(groups[1]);

      console.log('Got Date', value);

      // Example 13 de julio de 2020
      const data = value.split(' ');

      console.log('Date components', data);

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

      // TODO: Improve this, move it to a better place
      const dayNumber = Number(data[0]);
      const day = dayNumber < 10 ? '0' + dayNumber : dayNumber;

      if (data[2]) {
        const month = months[data[2].toLowerCase().trim()];
        const year = data[4];

        const date = day + '/' + month + '/' + year;
        const format = 'DD/MM/YYYY';

        return {
          formatter: this.formatters.date({ raw: date, format }),
          raw: value
        };
      }

      // we have the other date format
      // 21/07/2020 11:39:20
      return {
        formatter: this.formatters.date({
          raw: value,
          format: 'DD/MM/YYYY HH:mm:ss'
        }),
        raw: value
      };
    };

    const getFrom = () => {
      const regex = /[\S\s]*,\s*de\s*nuestro\(a\)\s*cliente\s*\*([\s\S]+)\*,/gim;
      const groups = this.groups(regex, body);
      const value = this.formatters.string(groups[1]);
      return value;
    };

    const getTo = () => {
      const regex = /[\s\S]*nombre\*\s*\*:\*([\s\S]+)\s*\*rut/gim;
      const groups = this.groups(regex, body);
      const value = this.formatters.string(groups[1]);
      return value;
    };

    const getAmount = () => {
      const regex = /[\s\S]*monto\s*transferido:\s*\*\$([\w.]+)/gim;
      const groups = this.groups(regex, body);
      const value = this.formatters.numeric(groups[1]);
      return value;
    };

    const getRut = () => {
      const regex = /[\s\S]*rut\*\s*\*:\*\s*(\S+)\s*\*banco\*/gim;
      const groups = this.groups(regex, body);
      const value = this.formatters.string(groups[1]);
      return value;
    };

    const getEntity = () => {
      const regex = /[\s\S]*\*banco\*\s*\*:\*\s*([\s\S]+)\*n[\s\S]*de\s*cuenta\*/gim;
      const groups = this.groups(regex, body);
      const value = this.formatters.string(groups[1]);
      return value;
    };

    const getAccount = () => {
      const regex = /[\s\S]*\*n[\s\S]*de\s*cuenta\*\s*\*:\*\s*([\s\S]+)\s*\*n\S+\s*de\s*operaci/gim;
      const groups = this.groups(regex, body);
      const value = this.formatters.string(groups[1]);
      return value;
    };

    const getTransactionId = () => {
      const regex = /[\s\S]*\*n\S+\s*de\s*operaci\S+\s*\*:\*\s*([\s\S]+)\s*\*comentario\*/gim;
      const groups = this.groups(regex, body);
      const value = this.formatters.string(groups[1]);
      return value;
    };

    const getComment = () => {
      const regex = /[\s\S]*\*comentario\*\s*\*:\*([\s\S]*)\[image:/gim;
      const groups = this.groups(regex, body);
      const value = this.formatters.string(groups[1]);
      return value;
    };

    return this.setResult({
      amount: getAmount(),
      context: getRut(),
      account: getAccount(),
      comment: getComment(),
      date: getDate(),
      meta: {
        from: getFrom(),
        to: getTo(),
        rut: getRut(),
        entity: getEntity(),
        transaction: getTransactionId()
      },
      parsed: true
    });
  }
}
