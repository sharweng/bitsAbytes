const express = require('express')
const app = express();
const cors = require('cors')
const path = require('path')

const products = require('./routes/product.route.js')
const users = require('./routes/user.route.js')
const reviews = require('./routes/review.route.js')

app.use(cors())
app.use(express.json())

app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/products', products)
app.use('/api/users', users)
app.use('/api/reviews', reviews)

module.exports = app