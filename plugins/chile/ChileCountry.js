import BaseCountry from '../../lib/countries';
import entities from './entities';
import currencies from './currencies';
import timezones from './timezones';

export default class ChileCountry extends BaseCountry {
  static get id() {
    return 'cl';
  }

  static get name() {
    return 'Chile';
  }

  static get entities() {
    return entities;
  }

  static get currencies() {
    return currencies;
  }

  static get timezones() {
    return timezones;
  }
}
