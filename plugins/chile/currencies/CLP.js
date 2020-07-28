import Currency from '../../../lib/currencies';

class CLP extends Currency {
  constructor () {
    super({
      name: 'Peso Chileno',
      symbol: '$',
      code: 'CLP',
      locale: 'es-CL',
      country: 'Chile'
    });
  }
}

export default CLP;
