// export a flat array of actions
import BaseAction from '../../../../../lib/actions/BaseAction';

class CustomAction extends BaseAction {
  constructor({ email, config }) {
    super({ email, config });
    console.log(
      'This action will be triggered on emails parsed on this entity only',
      email.element.entity.name
    );
  }
}

export { CustomAction };

export default [CustomAction];
