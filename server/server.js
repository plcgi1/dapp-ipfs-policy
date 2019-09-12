/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const path = require('path')

const express = require('express')

const config = require(path.resolve('./config/environment'))

const validateEnv = require(path.resolve('./src/validators/validate-env'))

// Connect to database with models loading
require(path.resolve('./src/models'))

// check env set
validateEnv()

// Setup server
const appHttp = express()

const server = require('http').createServer(appHttp)

// set middleware
require(path.resolve('./config/express'))(appHttp)
// set routes
require(path.resolve('./config/routes'))(appHttp)

appHttp.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

appHttp.use(function (err, req, res, next) {
  console.info('ERR', err)
  if (err.isBoom) {
    return res.status(err.output.statusCode).json(err.output.payload)
  }
  return next(err)
})

// Start server
server.listen(config.port, config.ip, () => {
  console.log('Express server listening on %d, in %s mode', config.port, appHttp.get('env'))
  // show discovered application routes
  appHttp._router.stack.forEach((r) => {
    console.info('Route', r.regexp)
  })
})

process.on('uncaughtException', (err) => {
  console.error('uncaughtException: ', err.message)
  console.error(err.stack)
  process.exit(1)
})

// Expose app
module.exports = appHttp
