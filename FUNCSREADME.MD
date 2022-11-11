# function to fetch page cookies

cookies = await utils.getCookies(page);

# execute node scripts from the package.json scrips

utils.executeNodeChildProcess("npm run create:example");

# timeout function

await utils.delay(milis)

# add this once page refresh

page.waitForNvigation({ waitUntil: "documentloaded"})

# function retry is like a race condition - you can add several elements function in the first param

# and then the number of tries in the second param

await utils.retry(() => Promise.all([main.elementClick(page), main.elementDiv(page)]), 5)

# assertion function

expect(element).to.eq('')

# function that login through a UI .

await utils.loginViaUi(page, URL, email, password)
.catch((err) => logger.error(`[error] - [${err}]`));

# info logger

logger.info(`[info]- [text here]`);

# error logger

logger.error(`[error] - [error here]`);

# api get call

res = await apiUtils.getCall(`url`, headers)

# wait for navifation command:

await page.waitForNavigation({
waitUntil: 'networkidle2',
timeout: 120000,
});
