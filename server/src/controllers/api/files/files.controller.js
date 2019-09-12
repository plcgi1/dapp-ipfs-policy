const path = require('path')

const { handleError } = require(path.resolve('./src/helpers/errors'))

const ThingProviderFactory = require(path.resolve('./src/providers/things'))

const pagination = require('../../../helpers/pagination')

exports.create = async (req, res) => {
  const { body, user } = req

  body.ownerId = user.id

  try {
    const factory = new ThingProviderFactory()
    const thingProvider = factory.getObjectProvider(body)

    const result = await thingProvider.create(body)

    return res.json(result)
  } catch (error) {
    return handleError(res, error, 500)
  }
}

exports.update = async (req, res) => {
  const { body, user } = req

  body.ownerId = user.id

  try {
    const factory = new ThingProviderFactory()
    const { thing, provider } = await factory.getObjectProviderById(body.id)

    if (!thing) {
      return handleError(res, { message: 'No such thing.' }, 404)
    }

    // TODO allow root update ???

    if (thing.ownerId !== user.id) {
      return handleError(res, { message: 'Only owner can update thing.' }, 401)
    }
    const result = await provider.update(thing.id, body)

    return res.json(result)
  } catch (error) {
    return handleError(res, error, 500)
  }
}

exports.get = async (req, res) => {
  try {
    const factory = new ThingProviderFactory()
    const { thing } = await factory.getObjectProviderById(req.query.id)

    if (!thing) {
      return handleError(res, { message: 'No such thing.' }, 404)
    }

    return res.json(thing)
  } catch (error) {
    return handleError(res, error, 500)
  }
}

exports.list = async (req, res) => {
  const factory = new ThingProviderFactory()
  const paging = pagination(req)

  try {
    const provider = await factory.getBaseProvider()

    const result = await provider.list(req.query, paging)

    return res.json(result)
  } catch (error) {
    return handleError(res, error, 500)
  }
}
