const { logger } = require('../../logger');
const utils = require('../utils/utils');
const infra = require('../utils/infraFuncs');

class Example {
  email = 'input[name="username"]';
  password = 'input[name="password"]';
  submitBtn = 'button[id="submit"]';
  logoutBtn = `//a[text()='Log out']`;
  addBtn = 'button[id="add_btn"]';
  confirmarionDiv = 'div[id="confirmation"]';
  testSection = 'section[id="food_list"]';

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

  async addBtnClick(page) {
    await infra.selectorClick(page, this.addBtn);
  }

  async waitForConfirmation(page) {
    await utils.retry([
      await infra.selectorExists(page, this.confirmarionDiv),
      await infra.selectorExists(page, this.testSection),
    ]);
  }
}

// create new class instance and lock it thus, make it immutable!
const examplePage = new Example();
Object.freeze(examplePage);

module.exports = examplePage;
