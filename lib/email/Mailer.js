/**
 * Gmail API Wrapper
 */
export default class Mailer {
  constructor(api = GmailApp) {
    this.api = api;
  }

  labelExists(label) {
    // https://developers.google.com/apps-script/reference/gmail/gmail-app#getUserLabelByName(String)
    const labelinstance = this.api.getUserLabelByName(label);

    if (!labelinstance) {
      console.log('No label named', label);
      return false;
    }

    return true;
  }

  formatMessage(message, query) {
    // https://developers.google.com/apps-script/reference/gmail/gmail-message

    const value = {
      subject: message.getSubject(),
      body: message.getPlainBody(),
      from: message.getFrom(),
      date: message.getDate(),
      id: message.getId(),
      isUnread: message.isUnread(),
      thread: message.getThread(),
      message,
      query
    };

    value.labels = value.thread
      .getLabels()
      .map((label) => this.formatLabel(label, query));

    console.log('Got Message', value);
    return value;
  }

  formatLabel(label, query) {
    // https://developers.google.com/apps-script/reference/gmail/gmail-label
    return {
      name: label.getName(),
      label,
      query
    };
  }

  search({ query, start, max }) {
    // https://developers.google.com/apps-script/reference/gmail/gmail-app#searchquery,-start,-max
    const results = [];
    // TODO: Improve this for more perfomance
    for (const item of query.queries) {
      const threads = this.api.search(item, start, max);

      console.log('Searching Emails With: ', item);
      console.log(threads.length, 'Threads found');
      let messages = [];
      let labels = [];

      // https://developers.google.com/apps-script/reference/gmail/gmail-thread
      threads.forEach((thread) => {
        messages = [
          ...messages,
          ...thread
            .getMessages()
            .map((message) => this.formatMessage(message, query))
        ];
        labels = [
          ...labels,
          ...thread.getLabels().map((label) => this.formatLabel(label, query))
        ];
      });

      results.push({ threads, messages, labels, query, start, max, item });
    }

    return results;
  }

  markAsRead(email) {
    console.log('Marking', email.message, 'As Read');
    // https://developers.google.com/apps-script/reference/gmail/gmail-app#markmessagesreadmessages
    this.api.markMessageRead(email.message.message);
  }
}
