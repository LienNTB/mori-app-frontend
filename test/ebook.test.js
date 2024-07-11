const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe("EBook Page", function() {
  this.timeout(30000);
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function() {
    await driver.quit();
  });

  function sleep(ms) {
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
    await driver.wait(until.urlContains('/homepage'), 10000);
  }

  async function getEBookElements(driver) {
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Đọc ngay')]")), 10000);
    return {
      readButton: await driver.findElement(By.xpath("//button[contains(text(),'Đọc ngay')]")),
      saveButton: await driver.findElement(By.xpath("//button[contains(text(),'Thêm vào thư viện')]")),
      heartButton: await driver.findElement(By.xpath("//button[3]//*[name()='svg']")),
      reviewTextarea: await driver.findElement(By.css('textarea')),
      sendReviewButton: await driver.findElement(By.css('.book_sendReviewBtn__i_0_p'))
    };
  }

  describe("BOOK FREE", function() {
    it("should display eBook page elements", async function() {
        await driver.get('http://localhost:3000/ebook/664ca0ec8179762b1337d32e');
        const { readButton, saveButton, heartButton, reviewTextarea, sendReviewButton } = await getEBookElements(driver);

        assert(await readButton.isDisplayed());
        assert(await saveButton.isDisplayed());
        assert(await heartButton.isDisplayed());
        assert(await reviewTextarea.isDisplayed());
        assert(await sendReviewButton.isDisplayed());
    });

    it("should read book successfully when clicking 'Read' button", async function() {
        await driver.get('http://localhost:3000/ebook/664ca0ec8179762b1337d32e');
        const { readButton } = await getEBookElements(driver);
        await readButton.click();
        await driver.wait(until.urlContains('/reader'), 10000);

        const currentUrl = await driver.getCurrentUrl();
        assert(currentUrl.includes('/reader'), 'Không chuyển hướng đến trang đọc sách.');
    });

    it("should save book successfully when clicking 'Save' button", async function() {
        await login('nguyenlien', 'bichLien#20110335');

        await driver.get('http://localhost:3000/ebook/664ca0ec8179762b1337d32e');
        const { saveButton } = await getEBookElements(driver);
        await saveButton.click();
        await sleep(1000);

        // Lấy giá trị của cửa sổ cảnh báo
        const alert = await driver.switchTo().alert();
        const registerAlertText = await alert.getText();

        // Kiểm tra giá trị của cửa sổ cảnh báo
        const expectedAlertText = 'Thêm sách Nếu Biết Trăm Năm Là Hữu Hạn vào thư viện?';
        if (registerAlertText === expectedAlertText) {
            console.log('Giá trị cửa sổ cảnh báo đúng');
        } else {
            console.error('Giá trị cửa sổ cảnh báo không đúng');
        }
        // Chấp nhận cửa sổ cảnh báo
        await alert.accept();

        // Kiểm tra nội dung và sự hiển thị của toast message
        await sleep(2000);
        await checkToastMessage(driver, '.go3958317564', 'Sách đã tồn tại trong thư viện!');
    });

    it("should like book successfully when clicking 'Heart' button", async function() {
        await driver.get('http://localhost:3000/ebook/664ca0ec8179762b1337d32e');
        const { heartButton } = await getEBookElements(driver);
        await heartButton.click();
        await sleep(1000);

        // Kiểm tra nội dung và sự hiển thị của toast message
        await checkToastMessage(driver, '.go3958317564', 'Hearted!');
    });

    it("should send review successfully with correct details", async function() {
        await login('nguyenlien', 'bichLien#20110335');
        await driver.get('http://localhost:3000/ebook/664ca0ec8179762b1337d32e');
        const { reviewTextarea, sendReviewButton } = await getEBookElements(driver);

        await reviewTextarea.sendKeys('Great book!');
        await sendReviewButton.click();
        await sleep(2000);

        // Kiểm tra nội dung và sự hiển thị của toast message
        await checkToastMessage(driver, '.go3958317564', 'Thêm review thành công!');
    });
  });

  describe("BOOK MEMBER", function() {
    it("should show error when reading book without logging in", async function() {
        await driver.get('http://localhost:3000/ebook/664c95c134e9d01f77e6f1b6');
        await sleep(1000);

        // đăng xuất tài khoản
        const account = await driver.wait(until.elementLocated(By.css('.Header_accountAvt__puLhX')),10000);
        await account.click();
        await driver.findElement(By.xpath("//div[@class='Header_container__Aasa1']//li[2]")).click();
        await sleep(1000);
        //
        await driver.get('http://localhost:3000/ebook/664c95c134e9d01f77e6f1b6');
        await sleep(1000);

        const { readButton } = await getEBookElements(driver);
        await readButton.click();
        await sleep(500);

        // Kiểm tra nội dung và sự hiển thị của toast message
        await checkToastMessage(driver, '.go3958317564', 'Vui lòng đăng nhập và đăng ký gói cước người dùng để đọc sách này!');
    });

    it("should show error when reading book without a membership plan", async function() {
        // đăng nhập
        await login('nguyenlien', 'bichLien#20110335');

        // đọc sách
        await driver.get('http://localhost:3000/ebook/664c95c134e9d01f77e6f1b6');
        const { readButton } = await getEBookElements(driver);
        await readButton.click();
        await sleep(1000);

        // Kiểm tra nội dung và sự hiển thị của toast message
        await checkToastMessage(driver, '.go3958317564', 'Vui lòng đăng kí gói cước người dùng để đọc sách này!');
    });

    it("should read book successfully when clicking 'Read' button", async function() {
        // đăng nhập
        await login('lientest', 'bichLien#20110335');

        // đọc sách
        await driver.get('http://localhost:3000/ebook/664c95c134e9d01f77e6f1b6');
        const { readButton } = await getEBookElements(driver);
        await readButton.click();
        
        await driver.wait(until.urlContains('/reader'), 10000)
        const currentUrl = await driver.getCurrentUrl();
        assert(currentUrl.includes('/reader'), 'Không chuyển hướng đến trang đọc sách.');
    });
  });
});
