const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe("Profile Page", function() {
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

  async function login(username, password) {
    await driver.get('http://localhost:3000/login');
    const usernameInput = await driver.findElement(By.css('input.login_div7__ond80'));
    const passwordInput = await driver.findElement(By.css('input.login_div9__yOW_d'));
    const signInButton = await driver.findElement(By.css('.login_div14__bjpo5'));

    await usernameInput.sendKeys(username);
    await passwordInput.sendKeys(password);
    await signInButton.click();

    // Wait until the homepage loads
    await driver.wait(until.urlContains('/homepage'), 20000);
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

  async function getAccountElements(driver) {
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Nghe')]")), 10000);
    return {
      listenButton: await driver.findElement(By.xpath("//button[contains(text(),'Nghe')]")),
      saveButton: await driver.findElement(By.xpath("//button[contains(text(),'Thêm vào thư viện')]")),
      heartButton: await driver.findElement(By.xpath("(//*[name()='svg'][@role='img'])[11]")),
      reviewTextarea: await driver.findElement(By.css('textarea')),
      sendReviewButton: await driver.findElement(By.css('.audiobook_sendReviewBtn__j9UZB')),
    };
  }

  describe("PROFILE PAGE", function() {
    before(async function() {
      await login('lientest', 'bichLien#20110335');
    });

    it("should display profile elements", async function() {
      await driver.get('http://localhost:3000/account/profile');

      const avatar = await driver.findElement(By.css('.profile_accountAvatar__b7kjE'));
      const displayName = await driver.findElement(By.css('.profile_title__pOn3S'));
      const followers = await driver.findElement(By.xpath("//div[contains(text(),'Người theo dõi')]"));
      const following = await driver.findElement(By.xpath("//div[contains(text(),'Đang theo dõi')]"));
      const posts = await driver.findElement(By.xpath("//div[contains(text(),'Bài viết')]"));

      assert(await avatar.isDisplayed());
      assert(await displayName.isDisplayed());
      assert(await followers.isDisplayed());
      assert(await following.isDisplayed());
      assert(await posts.isDisplayed());
    });

    it("should navigate to 'Thư viện của tôi' section and display elements", async function() {
      await driver.get('http://localhost:3000/account/library');
      const bookTable = await driver.findElement(By.css('.profile_libraryBody__ydCdZ'));
      assert(await bookTable.isDisplayed());
    });

    it("should navigate to 'Lịch sử đọc' section and display elements", async function() {
      await driver.get('http://localhost:3000/account/library');
      const history = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Lịch sử đọc')]")), 5000);
      await history.click();

      const historyTable = await driver.wait(until.elementLocated(By.css('.profile_libraryBody__ydCdZ')), 5000);
      assert(await historyTable.isDisplayed());
    });

    it("should navigate to 'Thông tin hội viên' section and display elements", async function() {
      await driver.get('http://localhost:3000/account/membership');
      const title = await driver.wait(until.elementLocated(By.xpath("//div[@class='profile_uHead__NgtF7']")), 10000).getText();
      assert(title == "Thông tin hội viên");
    });

    it("should navigate to 'Bài viết của tôi' section and display elements", async function() {
      await driver.get('http://localhost:3000/account/my-post');
      const title = await driver.wait(until.elementLocated(By.xpath("//div[@class='profile_uHead__NgtF7']")), 10000).getText();
      assert(title == "Bài viết của tôi");
    });

    it("should navigate to 'Sách đã mua' section and display elements", async function() {
      await driver.get('http://localhost:3000/account/my-book');
      const title = await driver.wait(until.elementLocated(By.xpath("//div[@class='profile_uHead__NgtF7']")), 10000).getText();
      assert(title == "Danh sách sách, truyện bạn đã mua");
    });

    ///////////////////////////////////

    it("should delete a book from library and display success message", async function() {
      await driver.get('http://localhost:3000/account/profile');
    
      const resetpwwButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Thay đổi mật khẩu')]")), 10000)
      await resetpwwButton.click();

      // Chờ đến khi chuyển trang
      await driver.wait(until.urlContains('/change-password'), 10000);
    });

    it("should delete a book from library and display success message", async function() {
      await driver.get('http://localhost:3000/account/library');
    
      // Chờ đợi số lượng hàng trong bảng được tải lên (ví dụ: ít nhất 1 hàng)
      await driver.wait(async function() {
        let rows = await driver.findElements(By.xpath("//div[@class='profile_libraryBody__ydCdZ']//table//tr"));
        return rows.length >= 1;
      }, 10000);
    
      // Kiểm tra lại số lượng hàng, nếu ít hơn 2 thì thêm sách vào thư viện
      let rows = await driver.findElements(By.xpath("//div[@class='profile_libraryBody__ydCdZ']//table//tr"));
      if (rows.length < 2) {
        await driver.get('http://localhost:3000/ebook/664ca0ec8179762b1337d32e');
        const saveButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Thêm vào thư viện')]")), 5000);
        await saveButton.click();
        await driver.switchTo().alert().accept();
        await sleep(500);
        
        // Quay lại thư viện và đợi cho đến khi sách mới được thêm vào
        await driver.get('http://localhost:3000/account/library');
        await driver.wait(async function() {
          rows = await driver.findElements(By.xpath("//div[@class='profile_libraryBody__ydCdZ']//table//tr"));
          return rows.length >= 2;
        }, 10000);
      }
    
      // Test xóa
      const deleteButton = await driver.wait(until.elementLocated(By.xpath("(//*[name()='svg'][@role='img'])[3]")),10000);
      await deleteButton.click();
      await sleep(1000);
      await checkToastMessage(driver, '.go3958317564', 'Xoá sách khỏi thư viện thành công!');
    });

    it("should create, edit and delete a reading goal successfully", async function() {
      await driver.get('http://localhost:3000/account/reading-goal');

      // Assuming there's a button to create a reading goal
      const createReadingGoalButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Thiết lập mục tiêu đọc sách')]")), 10000);
      await createReadingGoalButton.click();

      //create reading goal
      await driver.wait(until.elementLocated(By.xpath("(//span[@aria-hidden='true'])[2]")), 10000).click();
      await driver.findElement(By.xpath("(//span[@aria-hidden='true'])[6]")).click();
      await driver.findElement(By.xpath("(//button[normalize-space()='Submit'])[1]")).click();

      let message = await driver.wait(until.elementLocated(By.css('.go3958317564')), 10000).getText();
      if(message == "Processing..."){
        await checkToastMessage(driver, '.go3958317564', 'Tạo mục tiêu mới thành công!' || 'Bạn đã có mục tiêu đọc sách cho Ngày rồi!');
      }
      else{
        
      }

      //edit reading goal
      await driver.wait(until.elementLocated(By.xpath("(//*[name()='svg'][@data-icon='pencil'])[1]")), 10000).click();
      await driver.wait(until.elementLocated(By.xpath("(//span[@aria-hidden='true'])[2]")), 10000).click();
      await driver.findElement(By.xpath("(//span[@aria-hidden='true'])[6]")).click();
      await driver.findElement(By.xpath("//button[contains(text(),'Lưu')]")).click();

      message = await driver.wait(until.elementLocated(By.css('.go3958317564')), 10000).getText();
      if(message == "Processing..."){
        await checkToastMessage(driver, '.go3958317564', 'Chỉnh sửa mục tiêu đọc sách thành công!');
      }

      //delete
      await driver.wait(until.elementLocated(By.xpath("(//*[name()='svg'][@data-icon='xmark'])[1]")), 10000).click();
      await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Xóa mục tiêu')]")), 10000).click();
      message = await driver.wait(until.elementLocated(By.css('.go3958317564')), 10000).getText();
      if(message == "Processing..."){
        await checkToastMessage(driver, '.go3958317564', 'Xóa mục tiêu thành công!');
      }
    });
  });
});
