import { CLP } from '../../../currencies';
import { BaseParser } from '../../../../../lib/parsers';
import EntityName from '../EntityName';
import Labels from '../Labels';

export default class BaseBancoEstadoParser extends BaseParser {
  constructor({ email, config, type, name, label, version }) {
    super({
      email,
      config,
      entity: EntityName,
      type,
      name,
      label,
      version,
      currency: new CLP()
    });
  }

  static get entity() {
    return EntityName;
  }

  static get labels() {
    return Labels;
  }
}
