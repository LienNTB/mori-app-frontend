const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe("Login Page", function() {
  this.timeout(30000);
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function() {
    await driver.quit();
  });

  beforeEach(async function() {
    await driver.get('http://localhost:3000/login');
  });

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Hàm kiểm tra nội dung và sự hiển thị của toast message
  async function checkToastMessage(driver, cssSelector, expectedMessage) {
    // Đợi cho toast message hiển thị
    const toastMessage = await driver.wait(
      until.elementLocated(By.css(cssSelector)),
      10000
    );
    // Kiểm tra nội dung và sự hiển thị của toast message
    const isDisplayed = await toastMessage.isDisplayed();
    const text = await toastMessage.getText();
    assert.strictEqual(isDisplayed && text === expectedMessage, true, 'Toast message không hiển thị hoặc không chứa nội dung mong đợi.');
  }

  describe("Login", function() {
    it("should display login form", async function() {
      const welcomeText = await driver.findElement(By.xpath("//*[contains(text(), 'WELCOME BACK!')]"));
      const usernameInput = await driver.findElement(By.css('input.login_div7__ond80'));
      const passwordInput = await driver.findElement(By.css('input.login_div9__yOW_d'));
      const signInButton = await driver.findElement(By.xpath("//*[contains(text(), 'Sign In')]"));
      const continueWithText = await driver.findElement(By.xpath("//*[contains(text(), 'or continue with')]"));
      const socialLoginDiv = await driver.findElement(By.css('div.login_div16__86GRZ'));

      assert(await welcomeText.isDisplayed());
      assert(await usernameInput.isDisplayed());
      assert(await passwordInput.isDisplayed());
      assert(await signInButton.isDisplayed());
      assert(await continueWithText.isDisplayed());
      assert(await socialLoginDiv.isDisplayed());
    });

    it("should log in successfully with correct credentials", async function() {
      const usernameInput = await driver.findElement(By.css('input.login_div7__ond80'));
      const passwordInput = await driver.findElement(By.css('input.login_div9__yOW_d'));
      const signInButton = await driver.findElement(By.css('.login_div14__bjpo5'));

      await usernameInput.sendKeys('lientest');
      await passwordInput.sendKeys('bichLien#20110335');
      await signInButton.click();
      await sleep(1000);

      // Kiểm tra nội dung và sự hiển thị của toast message
      const myCssSelector = '.go2072408551';
      await checkToastMessage(driver, myCssSelector, 'Đăng nhập thành công!');

      await sleep(3000);
      const currentUrl = await driver.getCurrentUrl();
      assert(currentUrl.includes('/homepage'));
    });

    it("should display error for missing username", async function() {
      // Kiểm tra trường hợp không có tên người dùng
      const usernameInput = await driver.findElement(By.css('input.login_div7__ond80'));
      const passwordInput = await driver.findElement(By.css('input.login_div9__yOW_d'));
      const signInButton = await driver.findElement(By.css('.login_div14__bjpo5'));

      await passwordInput.sendKeys('bichLien#20110335');
      await signInButton.click();
      await sleep(1000);

      // Kiểm tra nội dung và sự hiển thị của toast message
      const myCssSelector = '.go2072408551';
      await checkToastMessage(driver, myCssSelector, 'Vui lòng nhập đủ thông tin đăng nhập!');
    });

    it("should display error for missing password", async function() {
      const usernameInput = await driver.findElement(By.css('input.login_div7__ond80'));
      const passwordInput = await driver.findElement(By.css('input.login_div9__yOW_d'));
      const signInButton = await driver.findElement(By.css('.login_div14__bjpo5'));

      // Kiểm tra trường hợp không có mật khẩu
      await usernameInput.sendKeys('lientest');
      await signInButton.click();
      await sleep(1000);

      const myCssSelector = '.go2072408551';
      await checkToastMessage(driver, myCssSelector, 'Vui lòng nhập đủ thông tin đăng nhập!');
    });

    it("should display error for invalid login credentials", async function() {
      const usernameInput = await driver.findElement(By.css('input.login_div7__ond80'));
      const passwordInput = await driver.findElement(By.css('input.login_div9__yOW_d'));
      const signInButton = await driver.findElement(By.css('.login_div14__bjpo5'));

      // Nhập sai username
      await usernameInput.sendKeys('lienaaaa');
      await passwordInput.sendKeys('bichLien#20110335');
      await signInButton.click();
      await sleep(3000);

      // Kiểm tra nội dung và sự hiển thị của toast message
      const myCssSelector = '.go2072408551';
      await checkToastMessage(driver, myCssSelector, 'Thông tin đăng nhập không đúng!');

      // Nhập sai password
      await usernameInput.clear();
      await usernameInput.sendKeys('lientest');
      await passwordInput.clear();
      await passwordInput.sendKeys('20110335');
      await signInButton.click();
      await sleep(3000);

      // Kiểm tra nội dung và sự hiển thị của toast message
      await checkToastMessage(driver, myCssSelector, 'Mật khẩu bạn nhập chưa chính xác');
    });
  });

  describe("Forgot Password", function() {
    it("Account not found", async function() {
      const forgotPasswordLink = await driver.findElement(By.xpath("//*[contains(text(), 'Forget password?')]"));
      await forgotPasswordLink.click();

      const emailInput = await driver.findElement(By.css('input[type="text"]'));
      const resetPasswordButton = await driver.findElement(By.xpath("//*[contains(text(), 'Reset password')]"));

      await emailInput.sendKeys('test@example.com');
      await resetPasswordButton.click();
      await sleep(3000);

      // Kiểm tra nội dung và sự hiển thị của toast message
      const myCssSelector = '.go2072408551';
      checkToastMessage(driver, myCssSelector, 'Account not found');
    });

    it("Password reset email sent", async function() {
      const forgotPasswordLink = await driver.findElement(By.xpath("//*[contains(text(), 'Forget password?')]"));
      await forgotPasswordLink.click();

      const emailInput = await driver.findElement(By.css('input[type="text"]'));
      const resetPasswordButton = await driver.findElement(By.xpath("//*[contains(text(), 'Reset password')]"));

      await emailInput.sendKeys('20110335@student.hcmute.edu.vn');
      await resetPasswordButton.click();
      await sleep(3000);

      // Kiểm tra nội dung và sự hiển thị của toast message
      const myCssSelector = '.go2072408551';
      checkToastMessage(driver, myCssSelector, 'Password reset email sent!');
    });

    it("Missing email", async function() {
      const forgotPasswordLink = await driver.findElement(By.xpath("//*[contains(text(), 'Forget password?')]"));
      await forgotPasswordLink.click();

      const resetPasswordButton = await driver.findElement(By.xpath("//*[contains(text(), 'Reset password')]"));
      await resetPasswordButton.click();
      await sleep(3000);

      // Kiểm tra nội dung và sự hiển thị của toast message
      const myCssSelector = '.go2072408551';
      checkToastMessage(driver, myCssSelector, 'Vui lòng nhập email!');
    });
  });

})
