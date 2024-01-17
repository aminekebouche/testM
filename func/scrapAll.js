const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer');
const userAgent = require('user-agents');


const fetchAllProductData = async (mot) => {

  const urls = [  
    {
      url: `https://www.castorama.fr/search?term=${mot}`,
      container: "li.b9bdc658",
      title : "p.ccb9d67a",
      brand : "div._5666d42c p.ccb9d67a",
      price : "div._5d34bd7a",
      image : "img._2fc6e0e9",
      imgAttribute : "src",
      urlCard : "a._64ca4dc5",
      host : "https://www.castorama.fr"
    },
     {
      url: `https://www.bricocash.fr/search?q=${mot}`,
      container: "article.ProductTile",
      title : "p.ProductTile-title a",
      brand : "p.ProductTile-brand a",
      price : "span.Price-amount",
      image : ".ProductTile-thumbImg[data-src]",
      imgAttribute : "data-src",
      urlCard : "div.ProductTile-header a",
      host : "https://www.bricocash.fr"
    },
    {
      url: `https://www.bricomarche.com/search?q=${mot}`,
      container: "article.ProductTile",
      title : "p.ProductTile-title a",
      brand : "p.ProductTile-brand a",
      price : "span.Price-amount",
      image : ".ProductTile-thumbImg[data-src]",
      imgAttribute : "data-src",
      urlCard : "div.ProductTile-header a",
      host : "https://www.bricomarche.com"
    },
    {
      url: `https://www.bricorama.fr/search?q=${mot}`,
      container: "article.ProductTile",
      title : "p.ProductTile-title a",
      brand : "p.ProductTile-brand a",
      price : "span.Price-amount",
      image : ".ProductTile-thumbImg[data-src]",
      imgAttribute : "data-src",
      urlCard : "div.ProductTile-header a",
      host : "https://www.bricorama.fr"
    },
    {
      url: `https://www.gedimat.fr/produitListe.php?searchString=${mot}`,
      container: "div.jscroll-inner > ul.listeProduit > li.produitVueListe",
      title : ".libelle-produit",
      brand : ".marque",
      price : "span.prixEuro",
      image : ".image img",
      imgAttribute : "src",
      urlCard : "a.libelle-produit",
      host : "https://www.gedimat.fr"
    },
    {
      url: `https://www.e.leclerc/recherche?q=${mot}`,
      container: "li.product-container",
      title : "div.product-label-brand a.product-label",
      brand : "div.product-label-brand p.product-brand",
      price : "div.price-unit",
      image : "a.product-visual img[src]",
      imgAttribute : "src",
      urlCard : "a.product-visual",
      host : "https://www.e.leclerc"
    },
    
  ];
  
  
 
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    //args: ['--no-sandbox', '--disable-setuid-sandbox'],
    userDataDir: "./tmp",
    //headless:true
  });

  const results = [];
  const promises = urls.map(async (config) => {
    const page = await browser.newPage();
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

        if (titleElement && priceText && urlElement) {
          return {
            name: titleElement ? titleElement.textContent.trim() : null,
            marque: brandElement ? brandElement.textContent.trim() : null,
            prix: priceText ? result : null,
            image: imageElement ? imageElement.getAttribute(config.imgAttribute) : null,
            stock : "En stock",
            note : 4.5,
            url: urlElement ? config.host+urlElement.getAttribute("href") : null,
  
          };
        }
        
      }, article, config);

      if (productData){
        results.push(productData);
      }
    }

    await page.close();
  });

  await Promise.all(promises);
  await browser.close();
  console.log(results.length)

  return results;
};


module.exports = fetchAllProductData;
