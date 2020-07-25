import { Types } from '../../../../../lib/parsers';
import { CLP } from '../../../currencies';
import makeEmail from '../../../../../lib/test/makeEmail';
import Labels from '../Labels';

import {
  BaseBancoEstadoParser,
  BancoEstadoDepositDonationParser as Parser
} from '../parsers';

const label = Labels.donation;

describe('BancoEstadoDepositDonationParser', () => {
  test('that class have static properties', () => {
    expect(Parser).toHaveProperty(
      'name',
      `${BaseBancoEstadoParser.entity} Donation Notification Parser`
    );
    expect(Parser).toHaveProperty('type', Types.deposit);
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
    [image: BancoEstado]
[image: BancoEstado]

Lunes 13 de Julio 2020
[image: BancoEstado]

Comprobante de Donaci=C3=B3n

Estimado(a) Corporaci=C3=B3n de Organizaciones Solidarias:

Te informamos que hoy *13 de Julio 2020*, has recibido una Donaci=C3=B3n, d=
e
nuestro(a) cliente *MARIA *, con los siguientes datos=
:

Monto Donaci=C3=B3n recibida: *$501*
[image: Bullet]

Detalles de la persona que realiz=C3=B3 la Donaci=C3=B3n:

Nombre

:

MARIA

RUT

:

22911910

Banco

:

BancoEstado
[image: Operaci=C3=B3n Realizada]
[image: Protegete de Estafas]
[image: BancoEstado]
    `;

    const parser = new Parser({ email: makeEmail({ body }) });
    const currency = new CLP();
    const result = parser.parse();

    expect(result).toHaveProperty('amount', 501);
    expect(result).toHaveProperty('context', 'estado');
    expect(result).toHaveProperty('account', '22911910');

    expect(result).toHaveProperty('type', Types.deposit);
    expect(result).toHaveProperty('entity', BaseBancoEstadoParser.entity);
    expect(result).toHaveProperty('comment', 'maria');
    expect(result).toHaveProperty('meta', {});
    expect(result).toHaveProperty('label', label);
    expect(result).toHaveProperty('currency', currency);

    const date = result.date;

    const raw = '13 de julio 2020';
    expect(date).toHaveProperty('raw', raw);
    expect(date).toHaveProperty('formatter');
    expect(date.formatter).toHaveProperty('format');

    const formatted = date.formatter.format('DD/MM/YYYY HH:mm');

    expect(formatted).toEqual('13/07/2020 00:00');
  });
});
