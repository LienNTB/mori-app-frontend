const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe("Reset Password Page", function () {
  this.timeout(30000);
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    await login('lientest', 'bichLien#20110335');
  });

  after(async function () {
    await driver.quit();
  });

  async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function checkToastMessage(driver, cssSelector, expectedMessage) {
    const toastMessage = await driver.wait(
      until.elementLocated(By.css(cssSelector)),
      10000
    );
    const isDisplayed = await toastMessage.isDisplayed();
    const text = await toastMessage.getText();
    assert.strictEqual(isDisplayed && text === expectedMessage, true, `Toast message không hiển thị hoặc không chứa nội dung mong đợi. Message: ${text}`);
  }

  async function login(username, password) {
    await driver.get('http://localhost:3000/login');
    const usernameInput = await driver.findElement(By.css('input.login_div7__ond80'));
    const passwordInput = await driver.findElement(By.css('input.login_div9__yOW_d'));
    const signInButton = await driver.findElement(By.css('.login_div14__bjpo5'));

    await usernameInput.sendKeys(username);
    await passwordInput.sendKeys(password);
    await signInButton.click();

    // Chờ đến khi trang chính sau đăng nhập hiển thị
    await driver.wait(until.urlContains('/homepage'), 20000);
  }

  it("should display the Reset Password form", async function () {
    await driver.get('http://localhost:3000/account/profile');
    
    const resetpwwButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Thay đổi mật khẩu')]")), 10000)
    await resetpwwButton.click();

    // Chờ đến khi chuyển trang
    await driver.wait(until.urlContains('/change-password'), 10000);
    const title = await driver.wait(until.elementLocated(By.css('.change-password_div4__vBMBS')), 10000);
    assert.strictEqual(await title.getText(), 'Password Change', 'Reset Password form is not displayed properly');
  });

  it("should show error when fields are empty", async function () {
    const changePasswordButton = await driver.findElement(By.css('.change-password_div14___6y_t'));
    await changePasswordButton.click();

    let message =  driver.wait(until.elementLocated(By.css('.go3958317564')), 10000).getText();
    while (message === 'Processing...') {
        message = await driver.wait(until.elementLocated(By.css('.go3958317564')), 10000).getText();
        await driver.sleep(500);
        await checkToastMessage(driver, '.go3958317564', 'Vui lòng nhập đủ thông tin!');
    }
  });

  it("should show error when passwords do not match", async function () {
    await driver.findElement(By.xpath("(//input[@type='password'])[1]")).sendKeys('bichLien#20110335');
    await driver.findElement(By.xpath("(//input[@type='password'])[2]")).sendKeys('bichLien#20110335');
    await driver.findElement(By.xpath("(//input[@class='change-password_div9__DirhP'])[1]")).sendKeys('differentPassword123');

    const changePasswordButton = await driver.findElement(By.css('.change-password_div14___6y_t'));
    await changePasswordButton.click();

    let message =  driver.wait(until.elementLocated(By.css('.go3958317564')), 10000).getText();
    while (message === 'Processing...') {
        message = await driver.wait(until.elementLocated(By.css('.go3958317564')), 10000).getText();
        await driver.sleep(500);
        await checkToastMessage(driver, '.go3958317564', 'Mật khẩu nhập lại không khớp!');
    }
  });

  it("should successfully change the password", async function () {
    await driver.findElement(By.xpath("(//input[@type='password'])[1]")).clear();
    await driver.findElement(By.xpath("(//input[@type='password'])[1]")).sendKeys('bichLien#20110335');
    await driver.findElement(By.xpath("(//input[@type='password'])[2]")).clear();
    await driver.findElement(By.xpath("(//input[@type='password'])[2]")).sendKeys('bichLien#20110335');
    await driver.findElement(By.xpath("(//input[@class='change-password_div9__DirhP'])[1]")).clear();
    await driver.findElement(By.xpath("(//input[@class='change-password_div9__DirhP'])[1]")).sendKeys('bichLien#20110335');

    const changePasswordButton = await driver.findElement(By.css('.change-password_div14___6y_t'));
    await changePasswordButton.click();

    let message =  driver.wait(until.elementLocated(By.css('.go3958317564')), 10000).getText();
    while (message === 'Processing...') {
        message = await driver.wait(until.elementLocated(By.css('.go3958317564')), 10000).getText();
        await driver.sleep(500);
        await checkToastMessage(driver, '.go3958317564', 'Cập nhật mật khẩu thành công!');
    }
  });
});
