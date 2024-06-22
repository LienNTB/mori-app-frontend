const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe("Book Purchase Page", function() {
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
    assert.strictEqual(isDisplayed && text === expectedMessage, true, 'Toast message không hiển thị hoặc không chứa nội dung mong đợi.');
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

  async function getPurchaseElements(driver) {
    const buyButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Mua lẻ ebook')]")), 10000);
    const readButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Đọc ngay')]")), 10000);
    const heartButton = await driver.wait(until.elementLocated(By.xpath("//button//*[name()='svg' and contains(@class, 'fa-heart')]")), 10000);
    const reviewTextarea = await driver.findElement(By.css('textarea'));
    const sendReviewButton = await driver.findElement(By.css('.book_sendReviewBtn__hXUP3'));

    return { buyButton, readButton, heartButton, reviewTextarea, sendReviewButton };
  }

  describe("BOOK PURCHASE", function() {
    it("should display purchase page elements", async function() {
        await driver.get('http://localhost:3000/book/659330e9ff7f147158b2036c');

        const { buyButton, readButton, heartButton } = await getPurchaseElements(driver);

        assert(await buyButton.isDisplayed());
        assert(await readButton.isDisplayed());
        assert(await heartButton.isDisplayed());
    });

    // // test khi chưa đăng nhập
    it("should show error when trying to read book without purchasing", async function() {
      await driver.get('http://localhost:3000/book/659330e9ff7f147158b2036c');

      const { readButton } = await getPurchaseElements(driver);
      await driver.executeScript('localStorage.clear();'); // Simulate not having purchased the book
      await readButton.click();
      await sleep(500);

      // Check for toast message
      await checkToastMessage(driver, '.go3958317564', 'Vui lòng đăng nhập và mua sách để đọc sách này!');
    });

    it("should send review successfully with correct details", async function() {
      await login('nguyenlien', 'bichLien#20110335');
      await driver.get('http://localhost:3000/book/659330e9ff7f147158b2036c');
      const { reviewTextarea, sendReviewButton } = await getPurchaseElements(driver);

      await reviewTextarea.sendKeys('Great book!');
      await sendReviewButton.click();
      await sleep(2000);

      // Kiểm tra nội dung và sự hiển thị của toast message
      await checkToastMessage(driver, '.go3958317564', 'Thêm review thành công!');
  });

    // // test nick đã mua sách
    it("should read book successfully when clicking 'Read' button", async function() {
        await login('lientest', 'bichLien#20110335');

        await driver.get('http://localhost:3000/book/659330e9ff7f147158b2036c');

        const { readButton } = await getPurchaseElements(driver);
        await readButton.click();

        await driver.wait(until.urlContains('/reader'), 10000);
        const currentUrl = await driver.getCurrentUrl();
        assert(currentUrl.includes('/reader'), 'Không chuyển hướng đến trang đọc sách.');
    });

    it("should show error when trying to buy book when already purchased", async function() {
      await login('lientest', 'bichLien#20110335');

      await driver.get('http://localhost:3000/book/659330e9ff7f147158b2036c');

      const { buyButton } = await getPurchaseElements(driver);
      await buyButton.click();
      await sleep(500);

      // Check for toast message
      await checkToastMessage(driver, '.go3958317564', 'Bạn đã mua sách này, để đọc tiếp vui lòng chọn đọc ngay');
    });

    it("should purchase book successfully when clicking 'Buy' button", async function() {
        await login('nguyenlien', 'bichLien#20110335');

        await driver.get('http://localhost:3000/book/659330e9ff7f147158b2036c');

        const { buyButton } = await getPurchaseElements(driver);
        await buyButton.click();

        // Check for redirect to payment page
        await driver.wait(until.urlContains('/payment'), 10000);
        const currentUrl = await driver.getCurrentUrl();
        assert(currentUrl.includes('/payment'), 'Không chuyển hướng đến trang thanh toán.');
    });


    // test nick chưa mua sách
    it("should like book successfully when clicking 'Heart' button", async function() {
        await login('nguyenlien', 'bichLien#20110335');

        await driver.get('http://localhost:3000/book/659330e9ff7f147158b2036c');

        const { heartButton } = await getPurchaseElements(driver);
        await heartButton.click();
        await sleep(1000);

        // Check for toast message
        await checkToastMessage(driver, '.go3958317564', 'Hearted!');
    });

    it("should show error when trying to read book without purchasing", async function() {
        await login('nguyenlien', 'bichLien#20110335');

        await driver.get('http://localhost:3000/book/659330e9ff7f147158b2036c');

        const { readButton } = await getPurchaseElements(driver);
        await readButton.click();
        await sleep(1000);

        // Check for toast message
        await checkToastMessage(driver, '.go3958317564', 'Vui lòng mua sách để đọc sách này!');
    });

  });
});
