// pragma mark - Actions
/**
 * Base class for every action
 */
export default class BaseAction {
  constructor({ email, config, version = null }) {
    this.email = email;
    this.config = config;
    this.version = version || BaseAction.version;
  }

  /**
   * Action version.
   * Try following SemVer or similar if possible.
   * @return {string} the current action version
   */
  static get version() {
    return '0.0.1';
  }

  get name() {
    return 'name';
  }

  run() {
    console.log('Run');
  }
}
