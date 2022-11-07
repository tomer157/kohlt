const { assert } = require('chai');
const puppeteer = require('puppeteer');
const expect = require('chai').expect;
require('dotenv').config();
const utils = require('../../support/utils/utils');
const { logger } = require('../../logger/index');
const URL = process.env('');
const SELECTED_ENV = utils.evaluateEnvironment(URL);
const puppeteerJson = require('../../puppetter.json');

describe(`test scafolding suite, environment: ${SELECTED_ENV}`, () => {
  let browser;
  let page;
  let cookies;
  const access = {
    name: 'accessToken',
    value: '',
    domain: URL,
    httpOnly: true,
    secure: true,
  };
  const email = process.env.email;
  const password = process.env.password;
  let accessToken;

  before(async () => {
    browser = await puppeteer.launch(puppeteerJson);
    page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 900 });
    await page.goto(URL, puppeteerJson.navigation);
    await utils
      .loginViaUi(page, URL, email, password)
      .catch((err) => logger.error(`[error] - [${err}]`));

    await utils.delay(3500);
    cookies = await utils.getCookies(page);
  });

  it(`test - 1`, async () => {
    logger.info(`[info]- [text here]`);
    logger.error(`[error] - [error here]`);
  });

  after(async () => {
    await utils.delay(3333);
    logger.info(`[info]- [delete cookies]`);
    accessToken = cookies[1].split('=');
    access.value = accessToken[1];
    await page.deleteCookie(access);

    logger.info(`[info]- [close page instance]`);
    await page.close();
    logger.info(`[info]- [close browser instance]`);
    await browser.close();
  });
});
