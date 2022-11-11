const { assert } = require('chai');
const puppeteer = require('puppeteer');
const expect = require('chai').expect;
require('dotenv').config();
const utils = require('../../support/utils/utils');
const { logger } = require('../../logger/index');
const URL = process.env['url'];
const SELECTED_ENV = utils.evaluateEnvironment(URL);
const puppeteerJson = require('../../puppetter.json');
const examplePage = require('../../support/pages/ExamplePage');
const apiUtils = require('../../support/utils/apiUtils');

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
    browser = await puppeteer.launch(puppeteerJson.dev);
    page = await browser.newPage();
    await page.setViewport({ width: 1800, height: 768 });
    await page.goto(URL, puppeteerJson.navigation);
    await utils
      .loginViaUi(page, URL, email, password)
      .catch((err) => logger.error(`[error] - [${err}]`));

    await utils.delay(3500);
    cookies = await utils.getCookies(page);
    logger.info(cookies);
  });

  it(`test - 1`, async () => {
    logger.info(
      `[info]- [Verify new page URL contains practicetestautomation.com/logged-in-successfully/]`
    );
    const nowUrl = await utils.fetchUrl(page);
    console.log(nowUrl);
    expect(nowUrl).to.eq(
      'https://practicetestautomation.com/logged-in-successfully/'
    );

    await utils.delay(1300);
  });

  it(`test - 2`, async () => {
    await utils.delay(4000);
    logger.info(`[info]- [click on the logout button]`);
    await examplePage.logoutBtnClick(page);
  });

  it(`test  - 3`, async () => {
    const res = await apiUtils.getCall(
      'https://jsonplaceholder.typicode.com/todos/1',
      {}
    );
    console.log(res.data);

    expect(res.data.name).to.eq('Leanne Graham');
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
