const Joi = require('joi')

module.exports = {
  body: {
    email: Joi
      .string()
      .required()
      .email(),

    password: Joi
      .string()
      .required()
  }
}
