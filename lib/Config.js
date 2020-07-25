// For Developer's Eyes Only
// pragma mark - Global
import { maxThreads } from './Constants';
/**
 * Provides access to application configuration
 */
export default class Config {
  constructor({ entities, actions, countries }) {
    this._actions = actions;
    this._entities = entities;
    this._countries = countries;
  }

  get maxThreads() {
    return maxThreads;
  }

  get actions() {
    return this._actions;
  }

  get entities() {
    return this._entities;
  }

  get countries() {
    return this._countries;
  }
}
