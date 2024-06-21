const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe("HomePage", function() {
  this.timeout(30000);
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function() {
    await driver.quit();
  });

  beforeEach(async function() {
    await driver.get('http://localhost:3000');
  });

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  it('display', async function() {
    //check header
    await driver.findElement(By.css(".Header_menuLaptop__2tD7o")).click()
    await driver.findElement(By.css(".Header_menuLaptop__2tD7o input")).click()
    //check footer
    const footer = await driver.findElement(By.css('footer'));
    // check danh mục
    await driver.findElement(By.css(".Header_danhmuc__vbubx")).click()
    await sleep(2000);// chờ danh mục load tags - cuộn chuột check 
    const danhMucElement = await driver.findElement(By.css(".gap-1"))
    const actions = driver.actions({async: true});
    await actions.move({origin: danhMucElement}).press().perform();
    await driver.actions({ bridge: true }).move(danhMucElement).perform()
    await driver.actions({ bridge: true }).move(danhMucElement).release().perform()
    const danhMucText = await danhMucElement.getText();
    assert.strictEqual(danhMucText.trim() !== '', true, 'Danh mục bị trống - lỗi load tags');
  })

  it("should display book categories", async function() {
    const bookSections = await driver.findElements(By.css('.homepage_bookSectionContainer__Og0C8'));
    assert(bookSections.length > 0, 'No book sections found');

    await sleep(3000);
    for (let section of bookSections) {
      const sectionHeader = await section.findElement(By.css('.homepage_sectionHeader__pfYbU'));
      assert(await sectionHeader.isDisplayed(), 'Section header not displayed');
      
      const bookList = await section.findElement(By.css('.homepage_sectionBody__QmY5K'));
      const listbookText = await bookList.getText();
      assert.strictEqual(listbookText.trim() !== '', true , 'Book list or bookcategories not displayed');
    }
  });

  it("should navigate to category pages when 'Xem thêm' is clicked", async function() {
    const viewMoreButtons = await driver.findElements(By.css('.homepage_bookSectionContainer__Og0C8:nth-child(4) .homepage_getmorebtn__fLrAS'));
    assert(viewMoreButtons.length > 0, 'No "Xem thêm" buttons found');

    for (let button of viewMoreButtons) {
      const href = await button.getAttribute('href');
      await button.click();
      await driver.wait(until.urlContains(href), 10000);
      const currentUrl = await driver.getCurrentUrl();
      assert(currentUrl.includes(href), `Failed to navigate to ${href}`);

      await driver.navigate().back();
      await sleep(2000); // Đợi trang tải lại trước khi kiểm tra nút tiếp theo
    }
  });

  it("should display user recommendations if logged in", async function() {
    // Đăng nhập tài khoản
    await driver.wait(until.elementLocated(By.linkText("Login"))).click();
    await sleep(3000);
    const usernameInput = await driver.findElement(By.css('input.login_div7__ond80'));
    const passwordInput = await driver.findElement(By.css('input.login_div9__yOW_d'));
    const signInButton = await driver.findElement(By.css('.login_div14__bjpo5'));

    await usernameInput.sendKeys('lientest');
    await passwordInput.sendKeys('bichLien#20110335');
    await signInButton.click();
    await sleep(4000); // Đợi một thời gian để dữ liệu tải xong

    const recommendationSection = await driver.findElement(By.xpath("//h3[contains(text(), 'Mori nghĩ bạn sẽ thích')]"));
    assert(await recommendationSection.isDisplayed(), 'Recommendation section not displayed');
  });
});
