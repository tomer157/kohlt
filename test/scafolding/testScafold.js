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
const practiceURL = process.env.practiceUrl;

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

  it(`test - 1 - verify page url`, async () => {
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

  it(`test - 2 - UI assertion and actions`, async () => {
    await page.goto(practiceURL, puppeteerJson.navigation);
    await examplePage.addBtnClick(page);
    await utils.delay(2100);
    await examplePage.waitForConfirmation(page);
  });

  it(`test - 3 - click on the logout button`, async () => {
    await utils.delay(4000);
    await page.goBack();
    await utils.delay(1200);
    logger.info(`[info]- [click on the logout button]`);
    await examplePage.logoutBtnClick(page);
  });

  it(`test  - 4 - use mock api GET call + assertion`, async () => {
    const res = await apiUtils.getCall(
      'https://jsonplaceholder.typicode.com/users/1',
      {}
    );
    console.log(res.data);
    expect(res.data.name).to.eq('Leanne Graham');
  });

  it(`test - 5 - execute node process scripts  in runtime!`, async () => {
    await utils.executeNodeChildProcess('npm run test:script');
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
