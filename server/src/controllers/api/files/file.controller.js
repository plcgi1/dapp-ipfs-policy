const path = require('path')

const { handleError } = require(path.resolve('./src/helpers/errors'))

const FilesProvider = require(path.resolve('./src/providers/file.provider'))

const pagination = require('../../../helpers/pagination')

exports.create = async (req, res) => {
  const { body, user } = req

  body.ownerId = user.id

  try {
    const provider = new FilesProvider()

    const result = await provider.create(body)

    return res.json(result)
  } catch (error) {
    return handleError(res, error, 500)
  }
}

exports.update = async (req, res) => {
  const { body, user } = req

  body.ownerId = user.id

  try {
    const provider = new FilesProvider()
    const result = await provider.update(body)

    return res.json(result)
  } catch (error) {
    return handleError(res, error, 500)
  }
}

exports.get = async (req, res) => {
  try {
    // const provider = new FilesProvider()

    return res.json({})
  } catch (error) {
    return handleError(res, error, 500)
  }
}

// exports.list = async (req, res) => {
//   const factory = new ThingProviderFactory()
//   const paging = pagination(req)
//
//   try {
//     const provider = await factory.getBaseProvider()
//
//     const result = await provider.list(req.query, paging)
//
//     return res.json(result)
//   } catch (error) {
//     return handleError(res, error, 500)
//   }
// }
