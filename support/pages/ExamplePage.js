const { logger } = require('../../logger');
const utils = require('../utils/utils');

class Example {
  email = '#email';

  constructor() {
    // singleton....
    if (Example.instance === null) {
      Example.this;
    }
    return Example.instance;
  }

  async emailType(page, params) {
    const exists = await page.$eval(this.email, () => true).catch(() => false);

    if (exists != true) {
      logger.error(`[error] - [${this.email} doesnt exists!]`);
      throw new Error(`${this.email} doesnt exists!`);
    }

    await page.type(this.email, params);
  }
}

// create new class instance and lock it thus, make it immutable!
const examplePage = new Example();
Object.freeze(examplePage);

module.exports = examplePage;
