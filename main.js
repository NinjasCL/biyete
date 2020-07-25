import Plugins from './plugins';
import Config from './lib/Config';
import Email from './lib/email';

// pragma mark - Main Function
const main = () => {
  console.log('Init');

  const config = new Config({
    entities: Plugins.entities,
    actions: Plugins.actions,
    countries: Plugins.countries
  });

  let emails = [];
  config.countries.forEach((CountryClass) => {
    const entities = [...CountryClass.entities, ...config.entities];
    const finder = new Email({ entities, config });
    emails = finder.getEmails();
  });

  emails.forEach((email) => {
    console.log('Running Entity Actions');
    email.element.entity.actions.forEach((ActionClass) => {
      // Apply specific action to email
      const action = new ActionClass({
        email,
        config
      });
      action.run();
    });

    console.log('Running Global Actions');
    config.actions.forEach((ActionClass) => {
      // Apply global action to every email
      const action = new ActionClass({ email, config });
      action.run();
    });

    email.markAsRead();
  });

  console.log('Done');
};

// Google Action do not supports exports.
// Remove "export default main;" in .gs file
// after build
// use: make release
export default main;
