import { Types } from '../../../../../lib/parsers';
import { CLP } from '../../../currencies';
import makeEmail from '../../../../../lib/test/makeEmail';
import Labels from '../Labels';

import {
  BaseBancoEstadoParser,
  BancoEstadoExpensePurchaseParser as Parser
} from '../parsers';

const label = Labels.purchase;

describe('BancoEstadoExpensePurchaseParser', () => {
  test('that class have static properties', () => {
    expect(Parser).toHaveProperty(
      'name',
      `${BaseBancoEstadoParser.entity} Purchase Notification Parser`
    );
    expect(Parser).toHaveProperty('type', Types.expense);
    expect(Parser).toHaveProperty('entity', BaseBancoEstadoParser.entity);
    expect(Parser).toHaveProperty('label', label);
  });

  test('that should not crash when passing an empty email', () => {
    const parser = new Parser({ email: makeEmail() });
    expect(parser).toHaveProperty('parse');

    const result = parser.parse();

    expect(result).toHaveProperty('amount', 0);
    expect(result).toHaveProperty('context');
    expect(result).toHaveProperty('account');
    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('entity');
    expect(result).toHaveProperty('comment');
    expect(result).toHaveProperty('meta', {});
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('label');
    expect(result).toHaveProperty('createdAt');
  });

  test('that should parse correctly normal email', () => {
    const body = `
    USUARIO

Se ha realizado una compra por $60.000 en CASA JUJU asociado a 
su tarjeta terminada en **** 0001 el dia 27/06/2020 a las 13:08hrs.
    `;

    const parser = new Parser({ email: makeEmail({ body }) });
    const currency = new CLP();
    const result = parser.parse();

    expect(result).toHaveProperty('amount', 60000);
    expect(result).toHaveProperty('context', 'casa juju');
    expect(result).toHaveProperty('account', '**** 0001');

    expect(result).toHaveProperty('type', Types.expense);
    expect(result).toHaveProperty('entity', BaseBancoEstadoParser.entity);
    expect(result).toHaveProperty('comment', '');
    expect(result).toHaveProperty('meta', {});
    expect(result).toHaveProperty('label', label);
    expect(result).toHaveProperty('currency', currency);

    const date = result.date;

    const raw = '27/06/2020 13:08';
    expect(date).toHaveProperty('raw', raw);
    expect(date).toHaveProperty('formatter');
    expect(date.formatter).toHaveProperty('format');

    const formatted = date.formatter.format('DD/MM/YYYY HH:mm');

    expect(formatted).toEqual(raw);
  });
});
