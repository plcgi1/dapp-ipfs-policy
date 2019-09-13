const UserProvider = require('../../../providers/user.provider')
const { handleError } = require('../../../helpers/errors')

module.exports = {
  getByAddress: async (req, res, next) => {
    const { query } = req

    const userProvider = new UserProvider()
    try {
      const user = await userProvider.getByAddress(query.publicAddress)

      return res.json(user)
    } catch (error) {
      return handleError(res, error, 500)
    }
  }
}