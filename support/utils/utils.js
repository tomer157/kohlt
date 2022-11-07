const { fs } = require('fs').promises;
const { logger } = require('../../logger');
const examplePage = require('../pages/ExamplePage');
require('dotenv').config();
const XLSX = require('xlsx');
const myDate = new Date();
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const rimraf = require('rimraf');
const { util } = require('chai');
const { stdout, stderr } = require('process');

let date = myDate
  .toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem' })
  .split('.')
  .join('/');
let time = myDate.toLocaleTimeString('he-IL', { timeZone: 'Asia/Jerusalem' });

class Utils {
  /**
   * @param {} page
   * @param {} url
   * @param {}
   *
   */

  loginViaUi = async (page, url, email, password) => {
    logger.info(`Login via ui page`);

    try {
      await page.goto(url, {
        timeout: 120000,
        waitUntil: 'networkkidle2',
      });

      await examplePage.emailType(page, email);
      await page.waitForNavigation({
        waitUntil: 'networkkidle2',
        timeout: 120000,
      });

      const cookies = await page.cookies();
      const accessToken = cookies.find((cok) => cok.name === 'accessToken');
      return accessToken;
    } catch (error) {
      logger.error(`[error] - [login error failed: ${error}]`);
      throw new Error(`login failed: ${error}`);
    }
  };

  fetchUrl = async (page) => {
    const url = await page.evaluate(() => document.location.href);
    return url;
  };

  getCookies = async (page) => {
    const pageCookies = await page.evaluate(() => document.cookie.split(';'));
    return pageCookies;
  };

  takeScreenShot = async (page) => {
    const picDate = myDate.toLocaleDateString('he-IL', {
      timeZone: 'Asia/Jerusalem',
    });

    await page.screenshot({
      path: `./screenshot/screenshot${picDate}-${time}.png`,
      fullPage: true,
    });
  };

  /**
   *
   * @param {*} page
   * @param {*} selector
   * @param {*} timeout
   * @implement utils.forceClickBySelector(page, this.email, 5000)
   * @returns
   */
  forceClickBySelector = async (page, selector, timeout) => {
    await page.waitForSelector(selector, { visible: true, timeout });

    let error;
    while (timeout > 0) {
      try {
        await page.click(selector);
        return;
      } catch (e) {
        await page.waitFor(100);
        timeout -= 100;
        error = e;
      }
    }
    throw error;
  };

  forceClickByXPATH = async (page, xpath, timeout) => {
    const el = await page.waitForXPath(xpath, { visible: true, timeout });

    let error;
    while (timeout > 0) {
      try {
        await el.click(xpath);
        return;
      } catch (e) {
        await page.waitFor(100);
        timeout -= 100;
        error = e;
      }
    }
    throw error;
  };

  deleteFolder = (path) => {
    rimraf(path, function () {
      logger.info(`done with folder deletion!`);
    });
  };

  delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  changeUrl = (url, port) => {
    try {
      url.port = port;
      return url;
    } catch (error) {
      throw new Error(error);
    }
  };

  pressTab = async (page) => {
    await page.keyboard.press('Tab');
  };

  writeFile = async (path, data) => {
    try {
      await fs.writeFile(path, data);
    } catch (error) {
      logger.error(`[error] - [${error}]`);
    }
  };

  writeFileXlsx = async (environment, version, result) => {
    try {
      const workbook = XLSX.readFile(`${__dirname}/example.xlsx`);
      let worksheets = {};

      for (const sheetName of workbook.SheetNames) {
        worksheets[sheetName] = XLSX.utils.sheet_add_json(
          workbook.Sheets[sheetName]
        );
      }

      worksheets.Sheet1.push({
        id: uuidv4(),
        date: date,
        time: time,
        'test env': environment,
        version: version,
        'result in seconds': result,
      });

      XLSX.utils.sheet_add_json(workbook.Sheets['Sheet1'], worksheets.Sheet1);
      XLSX.writeFile(workbook, `${__dirname}/example.xlsx`);
    } catch (error) {
      logger.error(`[error] - [${error}]`);
      throw new Error(error);
    }
  };

  /**
   * in test runtime spanws a shell then execute the command param
   * @param {} command
   */
  executeNodeChildProcess = (command) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }

      console.log(`stdout: ${stdout}`);
    });
  };

  reloadPage = async (page) => {
    await page.reload({ waitUntil: ['networkkidle2', 'documentloaded'] });
  };

  destroyAnObject = async (object) => {
    const keys = Object.keys(object);
    try {
      for (const key of keys) {
        await delete object[key];
      }
    } catch (error) {
      logger.error(`[error] - [delete  failed: ${error}]`);
    }
  };

  evaluateEnvironment = (url) => {
    let env;
    switch (url) {
      case process.env.localhost:
        env = 'localhost';
        break;
      case process.env.dev:
        env = 'dev-env';
        break;
    }

    return env;
  };

  /**
   * Uses recursion of a promise array . one or more promises
   * great for a race condition for several elements that takes time to load
   * @implemantation : await util.retry(() => Promise.all([firstelement, secondElement]), 5)
   */
  retry = async (promiseFactory, count) => {
    try {
      if (count <= 0) {
        throw error;
      }
      return await promiseFactory();
    } catch (error) {
      if (count <= 0) {
        throw error;
      }
    }

    return this.retry(promiseFactory, count - 1);
  };

  stopPageFromRefreshing = async (page) => {
    await page.evaluate(() => window.stop());
  };
}

const utils = new Utils();
module.exports = utils;
