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

  // find element css selector and type text to it
  async selectorTypeEvent(page, element, text) {
    const exists = await page.$eval(element, () => true).catch(() => false);
    if (exists != true) {
      logger.error(`[error] - [${element} doesnt exists!]`);
      throw new Error(`${element} doesnt exists!`);
    }

    await page.type(element, text);
  }

  // runs a loop over element with the same selector
  // chosses the nth and click it
  async selectorLoopClick(page, element, index) {
    const handleArr = await page.$$(element);
    handleArr[index].click();
  }

  async selectorFetchContent(page, element) {
    const exists = await page.$eval(element, () => true).catch(() => false);
    if (exists != true) {
      logger.error(`[error] - [${element} doesnt exists!]`);
      throw new Error(`${element} doesnt exists!`);
    }

    const val = await page.evaluate((el) => el.textContent, element);
    return val;
  }

  async xpathDbClick(page, element) {
    try {
      const perEl = await page.waitForXPath(element);
      await perEl.click({ clickCount: 2 });
    } catch (error) {
      logger.error(`[error] - [${element} doesnt exists!]`);
      throw new Error(`${element} doesnt exists!`);
    }
  }

  async xpathFindSiblings(page, element, className, child) {
    const el = await page.waitForXPath(
      `//${element}[contains(@class, ${className}) and contains(., ${child})]`
    );
    await el.click();
  }
}

const infraFuncs = new infraFuncs();
Object.freeze(infraFuncs);
module.exports = infraFuncs;
