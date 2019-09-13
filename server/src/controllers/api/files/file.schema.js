const Joi = require('joi')

module.exports = {
  create: {
    body: {
      cid: Joi
        .string()
        .required()
    }
  },
  get: {
    query: {
      cid: Joi
        .string()
        .required()
    }
  }
}
