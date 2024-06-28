const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe("Community Page", function() {
  this.timeout(30000);
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    await login('lientest', 'bichLien#20110335');
  });

  after(async function() {
    await driver.quit();
  });

  beforeEach(async function() {
    await driver.get('http://localhost:3000/community');
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

    // Chờ đến khi trang chính sau đăng nhập hiển thị
    await driver.wait(until.urlContains('/homepage'), 10000);
  }

  it("should display the header", async function() {
    const header = await driver.findElement(By.css('.Header_menuLaptop__KWZHU'));
    assert(await header.isDisplayed(), 'Header is not displayed');
  });

  it("should display posts", async function() {
    await sleep(3000); // Wait for posts to load
    const posts = await driver.findElements(By.css('.Community_postList___mc5j'));
    assert(posts.length > 0, 'No posts found');

    for (let post of posts) {
      const postTitle = await post.findElement(By.css('.Community_postTitle__yMMwb'));
      assert(await postTitle.isDisplayed(), 'Post title not displayed');
      const postBody = await post.findElement(By.css('.Community_postBody__LHpSR'));
      assert(await postBody.isDisplayed(), 'Post body not displayed');
    }
  });

  it("should navigate to user profile when clicking on user avatar", async function() {
    const userAvatar = await driver.wait(until.elementLocated(By.xpath("//img[@alt='avt']")),10000);
    await userAvatar.click();
    await sleep(500);
    const acc = await driver.wait(until.elementLocated(By.xpath("//li[@role='presentation']//li[1]")),1000);
    await acc.click();
    
    await driver.wait(until.urlContains('/account'), 10000);
  });

    it("should display post details when clicking on post title", async function() {
        const postTitle = await driver.wait(until.elementLocated(By.xpath("(//div[@class='Community_postTitle__yMMwb']/a)[1]")), 10000);
        const postDetailUrl = await postTitle.getAttribute('href');
        await postTitle.click();
        await driver.wait(until.urlContains(postDetailUrl), 10000);
        const currentUrl = await driver.getCurrentUrl();
        assert(currentUrl.includes(postDetailUrl), `Failed to navigate to ${postDetailUrl}`);
    });

    // it('should navigate to post detail page when post title is clicked', async function() {
    //     const postItems = await driver.findElements(By.xpath("(//div[@class='Community_postTitle__yMMwb'])"));
    //     assert(postItems.length > 0, 'No post items found');

    //     for (let postItem of postItems) {
    //         const postTitle = await postItem.findElement(By.xpath("(//div[@class='Community_postTitle__yMMwb']/a)"));
    //         const href = await postTitle.getAttribute('href');
    //         await postTitle.click();
    //         await driver.wait(until.urlContains(href), 10000);
    //         const currentUrl = await driver.getCurrentUrl();
    //         assert(currentUrl.includes(href), `Failed to navigate to ${href}`);

    //         await driver.navigate().back();
    //         await sleep(2000); // Đợi trang tải lại trước khi kiểm tra nút tiếp theo
    //     }
    // });

  it("should display tags associated with posts", async function() {
    await sleep(3000); // Wait for posts to load
    const tags = await driver.findElements(By.css('.Community_tagList__r1ut8'));
    assert(tags.length > 0, 'No tags found');

    for (let tag of tags) {
      assert(await tag.isDisplayed(), 'Tag not displayed');
    }
  });

  it("should display the footer", async function() {
    const footer = await driver.findElement(By.css('footer'));
    assert(await footer.isDisplayed(), 'Footer is not displayed');
  });
});
