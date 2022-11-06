const { logger } = require('../../logger');
const utils = require('../utils/utils');

class Infra {
  constructor() {
    if (this.Infra.instance === null) {
      Infra.instance = this;
    }
    return Infra.instance;
  }

  /** search for a selector */
  async selectorExists(page, element) {
    const exists = await page.$eval(element, () => true).catch(() => false);
    if (exists != true) {
      logger.error(`[error] - [${element} doesnt exists!]`);
      throw new Error(`${element} doesnt exists!`);
    } else {
      return true;
    }
  }

  /** find element by selector and click it! you can also force it with the added param {f: true} */
  async selectorClick(page, element, args) {
    const exists = await page.$eval(element, () => true).catch(() => false);
    if (exists != true) {
      logger.error(`[error] - [${element} doesnt exists!]`);
      throw new Error(`${element} doesnt exists!`);
    }

    if (args === { f: t }) {
      utils.forceClickBySelector(page, element, 5000);
    } else {
      await page.click(element);
    }
  }
}
