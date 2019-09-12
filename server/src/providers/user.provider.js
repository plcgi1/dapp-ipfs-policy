const { User } = require('../models')
const { USER_STATUSES } = require('../helpers/enums')
const { generateEmailFromOauthProfile } = require('../helpers/generators')

module.exports = class UserProvider {
  fillOauthParams (profile) {
    if (profile.email) {
      profile.status = USER_STATUSES.ready
    } else {
      profile.status = USER_STATUSES.waiting2confirmation
      // sometimes Facebook doesnt provide email - we need set it here from generate func
      profile.email = generateEmailFromOauthProfile(profile)
    }

    return profile
  }

  async getByEmail (email, options = {}) {
    let user
    if (options.scope) {
      user = await User.scope('jwt').findOne({ where: { email } })
    } else {
      user = await User.findOne({ where: { email } })
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
