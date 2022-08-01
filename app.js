const express = require('express')
const app = express()
const {getTopics} = require('./controllers/app.controller.js')


app.get('/api/topics', getTopics)

module.exports = app