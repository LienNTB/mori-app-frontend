const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe("Sign Up Page", function() {
  this.timeout(30000);
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function() {
    await driver.quit();
  });

  beforeEach(async function() {
    await driver.get('http://localhost:3000/signup');
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

  // Hàm để lấy các phần tử trên trang đăng ký
  async function getSignUpElements(driver) {
    return {
      emailInput: await driver.findElement(By.css('.signup_div7__9kbWy:nth-child(4)')),
      usernameInput: await driver.findElement(By.css('.signup_div7__9kbWy:nth-child(6)')),
      displayNameInput: await driver.findElement(By.css('.signup_div7__9kbWy:nth-child(8)')),
      passwordInput: await driver.findElement(By.css('.signup_div9__kxl7h:nth-child(10)')),
      retypePasswordInput: await driver.findElement(By.css('.signup_div9__kxl7h:nth-child(12)')),
      signUpButton: await driver.findElement(By.css('.signup_div14__YXzFP'))
    };
  }

  describe("Sign Up", function() {
    it("should display sign up form", async function() {
      const { emailInput, usernameInput, displayNameInput, passwordInput, retypePasswordInput, signUpButton } = await getSignUpElements(driver);

      assert(await emailInput.isDisplayed());
      assert(await usernameInput.isDisplayed());
      assert(await displayNameInput.isDisplayed());
      assert(await passwordInput.isDisplayed());
      assert(await retypePasswordInput.isDisplayed());
      assert(await signUpButton.isDisplayed());
    });

    it("should sign up successfully with correct details", async function() {
      const { emailInput, usernameInput, displayNameInput, passwordInput, retypePasswordInput, signUpButton } = await getSignUpElements(driver);

      await emailInput.sendKeys('test@example.com');
      await usernameInput.sendKeys('testuser');
      await displayNameInput.sendKeys('Test User');
      await passwordInput.sendKeys('StrongPass123!');
      await retypePasswordInput.sendKeys('StrongPass123!');
      await signUpButton.click();
      await sleep(3000);

      // Kiểm tra nội dung và sự hiển thị của toast message
      // await checkToastMessage(driver, '.go3958317564', 'Đăng kí tài khoản thành công!');

      await driver.wait(until.urlContains('/login'), 10000);
      const currentUrl = await driver.getCurrentUrl();
      assert(currentUrl.includes('/login'), 'Không chuyển hướng đến trang đọc sách.');
    });

    it("should display error for missing information", async function() {
      const { signUpButton } = await getSignUpElements(driver);
      await signUpButton.click();

      // Kiểm tra nội dung và sự hiển thị của toast message
      await checkToastMessage(driver, '.go3958317564', 'Vui lòng nhập đủ thông tin!');
    });

    it("should display error for invalid email", async function() {
      const { emailInput, usernameInput, displayNameInput, passwordInput, retypePasswordInput, signUpButton } = await getSignUpElements(driver);

      await emailInput.sendKeys('invalidemail');
      await usernameInput.sendKeys('testuser');
      await displayNameInput.sendKeys('Test User');
      await passwordInput.sendKeys('StrongPass123!');
      await retypePasswordInput.sendKeys('StrongPass123!');
      await signUpButton.click();

      // Kiểm tra nội dung và sự hiển thị của toast message
      await checkToastMessage(driver, '.go3958317564', 'Vui lòng nhập một địa chỉ email hợp lệ!');
    });

    it("should display error for invalid username", async function() {
      const { emailInput, usernameInput, displayNameInput, passwordInput, retypePasswordInput, signUpButton } = await getSignUpElements(driver);

      await emailInput.sendKeys('test@example.com');
      await usernameInput.sendKeys('test user'); // Invalid username with space
      await displayNameInput.sendKeys('Test User');
      await passwordInput.sendKeys('StrongPass123!');
      await retypePasswordInput.sendKeys('StrongPass123!');
      await signUpButton.click();

      // Kiểm tra nội dung và sự hiển thị của toast message
      await checkToastMessage(driver, '.go3958317564', 'Username chỉ được bao gồm chữ cái không dấu và số');
    });

    it("should display error for weak password", async function() {
      const { emailInput, usernameInput, displayNameInput, passwordInput, retypePasswordInput, signUpButton } = await getSignUpElements(driver);

      await emailInput.sendKeys('test@example.com');
      await usernameInput.sendKeys('testuser');
      await displayNameInput.sendKeys('Test User');
      await passwordInput.sendKeys('weakpass');
      await retypePasswordInput.sendKeys('weakpass');
      await signUpButton.click();

      // Kiểm tra nội dung và sự hiển thị của toast message
      await checkToastMessage(driver, '.go3958317564', 'Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt!');
    });

    it("should display error for non-matching passwords", async function() {
      const { emailInput, usernameInput, displayNameInput, passwordInput, retypePasswordInput, signUpButton } = await getSignUpElements(driver);

      await emailInput.sendKeys('test@example.com');
      await usernameInput.sendKeys('testuser');
      await displayNameInput.sendKeys('Test User');
      await passwordInput.sendKeys('StrongPass123!');
      await retypePasswordInput.sendKeys('DifferentPass123!');
      await signUpButton.click();

      // Kiểm tra nội dung và sự hiển thị của toast message
      await checkToastMessage(driver, '.go3958317564', 'Mật khẩu không khớp!');
    });

    it("should display error for existin gmail", async function() {
      const { emailInput, usernameInput, displayNameInput, passwordInput, retypePasswordInput, signUpButton } = await getSignUpElements(driver);

      await emailInput.sendKeys('20110335@student.hcmute.edu.vn'); // Email đã tồn tại
      await usernameInput.sendKeys('existinguser'); // Username đã tồn tại
      await displayNameInput.sendKeys('Existing User');
      await passwordInput.sendKeys('StrongPass123!');
      await retypePasswordInput.sendKeys('StrongPass123!');
      await signUpButton.click();
      await sleep(3000);

      // Kiểm tra nội dung và sự hiển thị của toast message
      await checkToastMessage(driver, '.go3958317564', 'Username or email has already existed!');
    });

    it("should display error for existin username", async function() {
      const { emailInput, usernameInput, displayNameInput, passwordInput, retypePasswordInput, signUpButton } = await getSignUpElements(driver);

      await emailInput.sendKeys('test@example.com');
      await usernameInput.sendKeys('nguyenlien'); // Username đã tồn tại
      await displayNameInput.sendKeys('Existing User');
      await passwordInput.sendKeys('StrongPass123!');
      await retypePasswordInput.sendKeys('StrongPass123!');
      await signUpButton.click();
      await sleep(3000);

      // Kiểm tra nội dung và sự hiển thị của toast message
      await checkToastMessage(driver, '.go3958317564', 'Username or email has already existed!');
    });
  });
});
