const Joi = require('joi')
const { THING_PROVIDERS } = require('../../../helpers/enums')

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
