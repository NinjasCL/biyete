export default class BaseCurrency {
  constructor ({
    name,
    symbol,
    code,
    country,
    locale,
    symbolPrefix = true,
    separator = '.',
    decimals = 0,
    decimalsSeparator = ','
  }) {
    this.name = name;
    this.symbol = symbol;

    // determines the position of the symbol
    // prefixed or suffixed.
    this.symbolPrefix = symbolPrefix;

    this.country = country;
    this.locale = locale;

    this.code = String(code).toUpperCase(); // ISO 4217
    this.decimals = Number(decimals);
    this.separator = separator;
    this.decimalsSeparator = decimalsSeparator;
  }

  format ({ value, locale = null, includeSymbol = true, includeCode = true }) {
    return `${includeSymbol ? this.symbol : ''} ${Math.round(
      value
    ).toLocaleString(locale || this.locale)} ${includeCode ? this.code : ''}`;
  }
}
