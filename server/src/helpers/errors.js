const log4js = require('log4js')

const logger = log4js.getLogger('file')

exports.handleError = (response, err, status) => {
  logger.error('ERROR: %o', err)

  const res = { message: err.message }
  let newStatus = 500

  if (status) {
    newStatus = status
  }
  if (err.code && parseInt(err.code, 10) > 200) {
    newStatus = err.code
  }

  if (err.errors && Object.keys(err.errors).length > 0) {
    res.errors = []

    Object.keys(err.errors).forEach((key) => {
      res.errors.push({ message: err.errors[key].message })
    })
  }

  return response.status(newStatus).json(res)
}
