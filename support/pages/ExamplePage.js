const { logger } = require('../../logger');
const utils = require('../utils/utils');
const infra = require('../../support/utils/infraFuncs');

class Example {
  email = 'input[name="username"]';
  password = 'input[name="password"]';
  submitBtn = 'button[id="submit"]';
  logoutBtn = `//a[text()='Log out']`;

  constructor() {
    // singleton....
    if (Example.instance === null) {
      Example.this;
    }
    return Example.instance;
  }

  async emailType(page, params) {
    await infra.selectorTypeEvent(page, this.email, params);
  }

  async passwordType(page, params) {
    await infra.selectorTypeEvent(page, this.password, params);
  }

  async submitBtnClick(page) {
    await infra.selectorClick(page, this.submitBtn);
  }

  async logoutBtnClick(page) {
    await infra.xpathClick(page, this.logoutBtn);
  }
}

// create new class instance and lock it thus, make it immutable!
const examplePage = new Example();
Object.freeze(examplePage);

module.exports = examplePage;
