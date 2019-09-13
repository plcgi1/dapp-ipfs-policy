const { User } = require('../models')

module.exports = class UserProvider {
  async getByAddress (publicAddress, options = {}) {
    let user
    if (options.scope) {
      user = await User.scope('jwt').findOne({ where: { publicAddress } })
    } else {
      user = await User.findOne({ where: { publicAddress } })
    }

    return user
  }

  async create (userData) {
    const newUser = await User.create({
      ...userData
    })

    return newUser
  }

  async update (user) {
    user.updatedAt = new Date()
    const result = await user.save()

    return result
  }

  async getById (id) {
    try {
      const user = await User.findByPk(id)

      return user
    } catch (error) {
      throw new Error(error)
    }
  }

  async list (where, include = [], pagination = { offset: 0, limit: 10 }) {
    const data = await User.scope('list').findAll({
      where,
      limit: pagination.limit,
      offset: pagination.offset
    })
    const count = await User.count({ where })

    return { data, count }
  }
}
