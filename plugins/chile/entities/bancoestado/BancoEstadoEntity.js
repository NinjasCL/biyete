import BaseEntity from '../../../../lib/entities/BaseEntity';
import EntityName from './EntityName';
import actions from './actions';
import parsers from './parsers';

export default class BancoEstadoEntity extends BaseEntity {
  static get id() {
    return 'cl.bancoestado';
  }

  static get name() {
    return EntityName;
  }

  static get actions() {
    return actions;
  }

  static get parsers() {
    return parsers;
  }
}
