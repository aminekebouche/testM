// index.js
const express = require('express');
const cors = require('cors');
const fetchProductData = require('./func/scrapAll');
const scrapOnebyOne = require ('./func/scrapOnebyOne');

const app = express();
const port = 5000;
app.use(cors());

// Route principale
app.get('/', (req, res) => {
  res.send('Bonjour, ceci est un serveur Express !');
});

app.get('/ping', (req, res) => {
  const {word} =req.query;

    console.log(word)
    res.send('pong');
  });

app.get('/fetch-products', async (req, res) => {
    const {word} =req.query;
    console.log(word);
    try {
      const productData = await fetchProductData(word);
      res.status(200).json(productData);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  });


  app.get('/scrapOnebyOne', async (req, res) => {
    const {word, site} =req.query;
    console.log(word, site);
    try {
      const productData = await scrapOnebyOne(word,site);
      res.status(200).json(productData);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  });

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
});
