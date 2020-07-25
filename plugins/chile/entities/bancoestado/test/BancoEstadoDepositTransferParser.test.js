import { Types } from '../../../../../lib/parsers';
import { CLP } from '../../../currencies';
import makeEmail from '../../../../../lib/test/makeEmail';
import Labels from '../Labels';

import {
  BaseBancoEstadoParser,
  BancoEstadoDepositTransferParser as Parser
} from '../parsers';

const label = Labels.transfer;

describe('BancoEstadoDepositTransferParser', () => {
  test('that class have static properties', () => {
    expect(Parser).toHaveProperty(
      'name',
      `${BaseBancoEstadoParser.entity} Transfer Notification Parser`
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
    *Comprobante de Transferencia Electr=C3=B3nica de Fondos (TEF)*
    Estimado(a) EMPRESA *

Te informamos que hoy *17 de julio de 2020*, has recibido una Transferencia
Electronica, de nuestro(a) cliente *JOSE A*, , con los
siguientes datos:

Monto transferido:*$501*

*Detalle del destinatario*
*Nombre* *:* EMPRESA
*RUT* *:* 00.000.000-0
*Banco* *:* BANCOESTADO
*N=C2=B0 de cuenta* *:* 91912929
*N=C3=BAmero de Operaci=C3=B3n* *:* 1i2312312
*Comentario* *:* Prueba



[image: bancoestado.cl]
Inf=C3=B3rmese sobre la garant=C3=ADa estatal de los dep=C3=B3sitos en su b=
anco o en el
sitio web de la Superintendencia de Bancos e Instituciones Financieras de
Chile.
    `;

    const parser = new Parser({ email: makeEmail({ body }) });
    const currency = new CLP();
    const result = parser.parse();

    expect(result).toHaveProperty('amount', 501);
    expect(result).toHaveProperty('context', '00.000.000-0');
    expect(result).toHaveProperty('account', '91912929');

    expect(result).toHaveProperty('type', Types.deposit);
    expect(result).toHaveProperty('entity', BaseBancoEstadoParser.entity);
    expect(result).toHaveProperty('comment', 'prueba');
    expect(result).toHaveProperty('meta', {
      entity: 'bancoestado',
      from: 'jose a',
      rut: '00.000.000-0',
      to: 'empresa',
      transaction: '1i2312312'
    });
    expect(result).toHaveProperty('label', label);
    expect(result).toHaveProperty('currency', currency);

    const date = result.date;

    const raw = '17 de julio de 2020';
    expect(date).toHaveProperty('raw', raw);
    expect(date).toHaveProperty('formatter');
    expect(date.formatter).toHaveProperty('format');

    const formatted = date.formatter.format('DD/MM/YYYY HH:mm');

    expect(formatted).toEqual('17/07/2020 00:00');
  });

  test('that should parse correctly normal email second format', () => {
    const body = `
    *Comprobante de Transferencia Electr=C3=B3nica de Fondos (TEF)*
*Estimado(a) EMPRESA*

Te informamos que hoy *21/07/2020 11:39:20*, has recibido una Transferencia
Electronica, de nuestro(a) cliente *Paola*, con los
siguientes datos:

Monto transferido: *$2.000*
*Detalle del destinatario*
*Nombre* *:* EMPRESA
*RUT* *:* 00.000.000-0
*Banco* *:* BancoEstado
*N=C2=B0 de cuenta* *:* 0020100020
*N=C3=BAmero de Operaci=C3=B3n* *:* 0000200
*Comentario* *:* Prueba 2

[image: bancoestado.cl]
Inf=C3=B3rmese sobre la garant=C3=ADa legal de los dep=C3=B3sitos en su ban=
co o en
www.cmfchile.cl
    `;

    const parser = new Parser({ email: makeEmail({ body }) });
    const currency = new CLP();
    const result = parser.parse();

    expect(result).toHaveProperty('amount', 2000);
    expect(result).toHaveProperty('context', '00.000.000-0');
    expect(result).toHaveProperty('account', '0020100020');

    expect(result).toHaveProperty('type', Types.deposit);
    expect(result).toHaveProperty('entity', BaseBancoEstadoParser.entity);
    expect(result).toHaveProperty('comment', 'prueba 2');
    expect(result).toHaveProperty('meta', {
      entity: 'bancoestado',
      from: 'paola',
      rut: '00.000.000-0',
      to: 'empresa',
      transaction: '0000200'
    });
    expect(result).toHaveProperty('label', label);
    expect(result).toHaveProperty('currency', currency);

    const date = result.date;

    const raw = '21/07/2020 11:39:20';
    expect(date).toHaveProperty('raw', raw);
    expect(date).toHaveProperty('formatter');
    expect(date.formatter).toHaveProperty('format');

    const formatted = date.formatter.format('DD/MM/YYYY HH:mm:ss');

    expect(formatted).toEqual(raw);
  });
});
