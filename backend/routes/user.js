const express = require('express')
const { postUrl, fetchUrls, redirectUrl } = require('../controllers/user')
const app = express.Router()

app.post('/api/shorten', postUrl)
app.get('/api/urls', fetchUrls)
app.get('/:shortCode', redirectUrl)

module.exports = app