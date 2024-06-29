const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe("Post Page", function() {
  this.timeout(30000);
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    await login('lientest', 'bichLien#20110335');
    await driver.get('http://localhost:3000/post/6635d170a4fa5e59777a3e86');
  });

  after(async function() {
    await driver.quit();
  });

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function checkToastMessage(driver, cssSelector, expectedMessages) {
    const toastMessage = await driver.wait(
      until.elementLocated(By.css(cssSelector)),
      10000
    );
    const isDisplayed = await toastMessage.isDisplayed();
    const text = await toastMessage.getText();
    // Kiểm tra xem text có nằm trong expectedMessages hay không
    const isExpectedMessage = expectedMessages.includes(text);
    assert.strictEqual(isDisplayed && isExpectedMessage, true, `Toast message không hiển thị hoặc không chứa nội dung mong đợi. Message: ${text}`);
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

  async function getPostElements(driver) {
    await driver.wait(until.elementLocated(By.css('.post_postContainer__g_9K3')), 10000);
    return {
      likeButton: await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'post_blackHeart__AVmmD') or contains(@class, 'post_redHeart__BwPhG')]")), 10000),
      shareButton: await driver.findElement(By.xpath("//*[contains(@class, 'post_blackShare__8Ttir') or contains(@class, 'post_blueShare__pR6e2')]")),
      commentTextarea: await driver.wait(until.elementLocated(By.xpath("//label[@for='comment']")), 20000),
      sendCommentButton: await driver.wait(until.elementLocated(By.xpath("//button[normalize-space()='Post comment']")), 20000),
    };
  }

  describe("POST FUNCTIONALITIES", function() {
    it("should display post page elements", async function() {
      const { likeButton, shareButton, commentTextarea, sendCommentButton } = await getPostElements(driver);

      assert(await likeButton.isDisplayed());
      assert(await shareButton.isDisplayed());
      assert(await commentTextarea.isDisplayed());
      assert(await sendCommentButton.isDisplayed());
    });

    it("should like post successfully when clicking 'Heart' button", async function() {
      const { likeButton } = await getPostElements(driver);
      await likeButton.click();
      await sleep(1000);

      // Kiểm tra nội dung và sự hiển thị của toast message
      await checkToastMessage(driver, '.go3958317564', ['Hearted!', 'Unhearted!']);
    });

    it("should share post successfully when clicking 'Share' button", async function() {
      const { shareButton } = await getPostElements(driver);
      await shareButton.click();
      await sleep(1000);
    });

    it("should send comment successfully with correct details", async function() {
      const { commentTextarea, sendCommentButton } = await getPostElements(driver);

      await commentTextarea.sendKeys('Great post!');
      await sendCommentButton.click();
      await sleep(1000);

      // Kiểm tra nội dung và sự hiển thị của toast message
      await checkToastMessage(driver, '.go3958317564', 'Bình luận đã được gửi cho ban kiểm duyệt!');
    });
  });
});
