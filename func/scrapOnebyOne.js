const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer');
const userAgent = require('user-agents');








const scrapOnebyOne = async (mot, site) => {

    const urls = [
    ];
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      //args: ['--no-sandbox', '--disable-setuid-sandbox'],
      userDataDir: "./tmp",
      //headless:true
    });
  
    const results = [];
    const page = await browser.newPage();
    const config = urls[site]
    await page.setUserAgent(userAgent.random().toString());
    await page.goto(config.url, {
      waitUntil: "networkidle0",
    });
  
      const productContainer = await page.$$(config.container);
  
      for (const article of productContainer) {
        const productData = await page.evaluate((el, config) => {
          const titleElement = el.querySelector(config.title);
          const brandElement = el.querySelector(config.brand);
          const priceElement = el.querySelector(config.price);
          const imageElement = el.querySelector(config.image);
          const urlElement = el.querySelector(config.urlCard);


          const priceText = priceElement ? priceElement.textContent.trim() : null;
          let result = null;
          if (priceText){
            const cleanedString = priceText.replace(/,/g, '.');
            const numericString = cleanedString.replace(/[^\d.]/g, '');
            result = parseFloat(numericString);
          }
          
  
          return {
            name: titleElement ? titleElement.textContent.trim() : null,
            marque: brandElement ? brandElement.textContent.trim() : null,
            prix: priceText ? result : null,
            image: imageElement ? imageElement.getAttribute(config.imgAttribute) : null,
            stock : "En stock",
            note : 4.5,
            url: urlElement ? config.host+urlElement.getAttribute("href") : null,
  
          };
        }, article, config);
  
        results.push(productData);
      }
  
      await page.close();
  
    await browser.close();
    console.log(results.length)
  
    return results;
  };
  
  
  module.exports = scrapOnebyOne;