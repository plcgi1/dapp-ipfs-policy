const path = require('path')

/* eslint-disable */
module.exports = (app) => {
  app.use('/api/auth', require(path.resolve('./src/controllers/api/auth')))
  app.use('/api/users', require(path.resolve('./src/controllers/api/users')))
  app.use('/api/files', require(path.resolve('./src/controllers/api/files')))
};
/* eslint-enable */
