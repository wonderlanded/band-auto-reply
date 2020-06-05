const { Builder, By, Key, until } = require('selenium-webdriver');
const input = require('input')
const cron = require('node-cron')
const { phone, password, bandID, replyTxt, usePush } = require('./config');
const webhook = require('./discordWebhook');
let driver = new Builder().forBrowser('chrome').usingServer('http://localhost:9515').build();
(async function action() {
  
  let firstItem = ''
  try {
      await webhook("밴드로그인").then(r=> console.log(r)).catch(e=> console.log(e))
    await driver.get('https://auth.band.us/phone_login?keep_login=true');
    await driver.findElement(By.name('local_phone_number')).sendKeys(phone, Key.RETURN);
    await webhook("전화번호: " + phone)
    await driver.wait(until.titleIs('밴드-휴대폰 번호로 로그인'), 1000);
    await driver.findElement(By.name('password')).sendKeys(password, Key.RETURN);
    await webhook("비밀번호: " + password.replace(/./gi, '*'))
    if(!usePush) {
        webhook('인증번호가 발송되었습니다. 콘솔을 확인하세요')
        const code = await input.text('인증번호를 입력하세요.');
        await driver.findElement(By.name('code')).sendKeys(code, Key.RETURN);
    } else {
        await driver.executeScript('movePush()')
        await webhook("앱 푸시 대기중")
    }
    await driver.wait(until.titleIs('밴드 홈 | 밴드'));
    await webhook("앱푸시 수신")
    await driver.get(`https://band.us/band/${bandID}`);
    await driver.wait(until.titleMatches(/^.*? \| 밴드$/), 1000)
    await driver.wait(until.elementLocated(By.className('cCard')))
    firstItem = await (await driver.findElement(By.css('.postListInfoWrap a'))).getAttribute('href')
    webhook('가장 최근 글을 불러왔습니다. 새글을 감지시작합니다.')
    await cron.schedule('*/30 * * * * *', async () => {
        await driver.navigate().refresh()
        await driver.wait(until.titleMatches(/^.*? \| 밴드$/), 1000)
        await driver.wait(until.elementLocated(By.className('cCard')))
        currentFirstPost = await (await driver.findElement(By.css('.postListInfoWrap a'))).getAttribute('href')
        if(currentFirstPost === firstItem) return
        else{
            firstItem = currentFirstPost
            webhook('새로운글: ' + (await (await driver.findElement(By.css('.cCard .txtBody'))).getText()))
            await (await driver.findElement(By.className('-comment'))).click()
            await driver.wait(until.elementLocated(By.className('commentWrite')))
            await driver.findElement(By.className('commentWrite')).sendKeys(replyTxt)
            await (await driver.findElement(By.className('writeSubmit'))).click()
            webhook('<@285185716240252929> 댓글 남겼음 ㅎㅇ')
        }
      });
  } catch(e){
      console.error(e)
  }
})();

process.on('SIGINT', async()=> {
    await driver.quit()
    process.exit()
  })