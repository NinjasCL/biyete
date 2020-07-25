import Mailer from './Mailer';
import QueryBuilder from './QueryBuilder';

export default class Email {
  constructor({ entities, config, mailer = null, queryBuilder = null }) {
    this.api = mailer || new Mailer();
    this.queryBuilder = queryBuilder || new QueryBuilder({ entities, config });
    this.entities = entities;
    this.max = config.maxThreads;
    this.config = config;
  }

  getEmails() {
    const results = this.api.search({
      query: this.queryBuilder,
      start: 0,
      max: this.max
    });

    console.log('Results', results);

    const emails = [];
    for (const threads of results) {
      for (const thread of threads.threads) {
        const { messages, labels } = threads;

        for (const message of messages) {
          if (message.isUnread) {
            const email = {
              labels,
              message,
              element: {},
              info: {},
              thread
            };

            email.markAsRead = () => {
              this.api.markAsRead(email);
            };

            const element = this.queryBuilder.elementForLabels({
              labels
            });

            if (element) {
              console.log('Parsing Element', element);
              const Parser = element.parser;
              if (Parser) {
                const parser = new Parser({ email, config: this.config });
                if (parser) {
                  console.log('Parser Found', { parser, labels });
                  try {
                    const info = parser.parse();
                    console.log('Info', info);
                    if (info && info.parsed) {
                      email.info = info;
                      email.element = element;
                      console.log('Email was parsed. Saving to list');
                      emails.push(email);
                    } else {
                      console.warn('Could not parse Email', email);
                      email.markAsRead();
                    }
                  } catch (ex) {
                    console.warn(ex);
                    email.markAsRead();
                  }
                }
              }
            }
          }
        }
      }
    }
    console.log(emails.length, 'Unread Emails found');
    return emails;
  }
}
