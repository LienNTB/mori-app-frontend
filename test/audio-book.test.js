const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe("AudioBook Page", function() {
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
    assert.strictEqual(isDisplayed && text === expectedMessage, true, `Toast message không hiển thị hoặc không chứa nội dung mong đợi. message ${text}`);
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

  async function getAudioBookElements(driver) {
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Nghe')]")), 10000);
    return {
      listenButton: await driver.findElement(By.xpath("//button[contains(text(),'Nghe')]")),
      saveButton: await driver.findElement(By.xpath("//button[contains(text(),'Thêm vào thư viện')]")),
      heartButton: await driver.findElement(By.xpath("(//*[name()='svg'][@role='img'])[11]")),
      reviewTextarea: await driver.findElement(By.css('textarea')),
      sendReviewButton: await driver.findElement(By.css('.audiobook_sendReviewBtn__j9UZB')),
    };
  }

  describe("AUDIO BOOK FREE", function() {
    it("should display audiobook page elements", async function() {
        await driver.get('http://localhost:3000/audio-book/656eef18a09708917971ab2b');
        const { listenButton, saveButton, heartButton, reviewTextarea, sendReviewButton} = await getAudioBookElements(driver);

        assert(await listenButton.isDisplayed());
        assert(await saveButton.isDisplayed());
        assert(await heartButton.isDisplayed());
        assert(await reviewTextarea.isDisplayed());
        assert(await sendReviewButton.isDisplayed());
        // assert(await audioPlayer.isDisplayed());
    });

    it("should play audio successfully when clicking 'Listen' button", async function() {
        await driver.get('http://localhost:3000/audio-book/656eef18a09708917971ab2b');
        const { listenButton } = await getAudioBookElements(driver);
        await listenButton.click();
        await sleep(500);

        // Chờ cho phần tử audioPlayer xuất hiện
        const audioPlayer = await driver.wait(until.elementLocated(By.xpath("//div[@class='ChapterAudioPlayer_chapterAudioPlayer__SijhM']")), 5000)
        // Lấy giá trị currentTime từ phần tử audioPlayer
        audioPlayer.findElement(By.tagName('audio')).getAttribute('currentTime').then(currentTime => {
          // Kiểm tra giá trị currentTime
          assert(parseFloat(currentTime) > 0, 'Audio không bắt đầu phát.');
        });
    });

    it("should save audiobook successfully when clicking 'Save' button", async function() {
        await login('nguyenlien', 'bichLien#20110335');

        await driver.get('http://localhost:3000/audio-book/656eef18a09708917971ab2b');
        const { saveButton } = await getAudioBookElements(driver);
        await saveButton.click();
        await sleep(1000);

        // Lấy giá trị của cửa sổ cảnh báo
        const alert = await driver.switchTo().alert();
        const registerAlertText = await alert.getText();

        // Kiểm tra giá trị của cửa sổ cảnh báo
        const expectedAlertText = 'Thêm sách Atomic habits - Thói quen nguyên tử vào thư viện?';
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

    it("should like audiobook successfully when clicking 'Heart' button", async function() {
        await driver.get('http://localhost:3000/audio-book/656eef18a09708917971ab2b');
        const { heartButton } = await getAudioBookElements(driver);
        await heartButton.click();
        await sleep(1000);

        // Kiểm tra nội dung và sự hiển thị của toast message
        await checkToastMessage(driver, '.go3958317564', 'Hearted!');
    });

    it("should send review successfully with correct details", async function() {
        await login('nguyenlien', 'bichLien#20110335');
        await driver.get('http://localhost:3000/audio-book/656eef18a09708917971ab2b');
        const { reviewTextarea, sendReviewButton } = await getAudioBookElements(driver);

        await reviewTextarea.sendKeys('Great audiobook!');
        await sendReviewButton.click();
        await sleep(2000);

        // Kiểm tra nội dung và sự hiển thị của toast message
        await checkToastMessage(driver, '.go3958317564', 'Thêm review thành công!');
    });
  });

  describe("AUDIO BOOK MEMBER", function() {
    it("should show error when listening to audiobook without logging in", async function() {
        await driver.get('http://localhost:3000/audio-book/6570bfb8080acd8b8e1c2fd7');
        await sleep(1000);
        // đăng xuất tài khoản
        await driver.executeScript('localStorage.clear();');

        const { listenButton } = await getAudioBookElements(driver);
        await listenButton.click();
        await sleep(1000);

        // Kiểm tra nội dung và sự hiển thị của toast message
        await checkToastMessage(driver, '.go3958317564', 'Vui lòng đăng nhập và đăng ký gói cước người dùng để nghe sách này!');
    });

    it("should show error when listening to audiobook without a membership plan", async function() {
        // đăng nhập
        await login('nguyenlien', 'bichLien#20110335');

        // nghe sách
        await driver.get('http://localhost:3000/audio-book/6570bfb8080acd8b8e1c2fd7');
        const { listenButton } = await getAudioBookElements(driver);
        await listenButton.click();
        await sleep(1000);

        // Kiểm tra nội dung và sự hiển thị của toast message
        await checkToastMessage(driver, '.go3958317564', 'Vui lòng đăng kí gói cước người dùng để nghe sách này!');
    });

    it("should listen to audiobook successfully when clicking 'Listen' button", async function() {
        // đăng nhập
        await login('lientest', 'bichLien#20110335');

        // nghe sách
        await driver.get('http://localhost:3000/audio-book/6570bfb8080acd8b8e1c2fd7');
        const { listenButton} = await getAudioBookElements(driver);
        await listenButton.click();
        await sleep(500);
        
        // Chờ cho phần tử audioPlayer xuất hiện
        const audioPlayer = await driver.wait(until.elementLocated(By.xpath("//div[@class='ChapterAudioPlayer_chapterAudioPlayer__SijhM']")), 5000)
        // Lấy giá trị currentTime từ phần tử audioPlayer
        audioPlayer.findElement(By.tagName('audio')).getAttribute('currentTime').then(currentTime => {
          // Kiểm tra giá trị currentTime
          assert(parseFloat(currentTime) > 0, 'Audio không bắt đầu phát.');
        });
    });
  });
});
