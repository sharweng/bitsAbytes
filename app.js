const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path')

const products = require('./routes/product.route.js');

app.use(cors())
app.use(express.json())
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/products', products);

module.exports = app