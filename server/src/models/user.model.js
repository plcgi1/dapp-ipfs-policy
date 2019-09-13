const { USER_STATUSES } = require('../helpers/enums')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      nonce: {
        allowNull: false,
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: () => Math.floor(Math.random() * 1000000) // Initialize with a random nonce
      },
      publicAddress: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: { isLowercase: true }
      },
      username: {
        type: DataTypes.STRING,
        unique: true
      },
      status: {
        type: DataTypes.ENUM,
        values: Object.values(USER_STATUSES),
        defaultValue: USER_STATUSES.waiting
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Date.now()
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Date.now()
      }
    },
    {
      defaultScope: {
        attributes: {
          exclude: [
            'nonce'
          ]
        }
      },
      scopes: {
        list: {
          attributes: {
            exclude: [
              'nonce'
            ]
          }
        },
        jwt: {
          attributes: ['id', 'publicAddress', 'nonce']
        }
      },
      indexes: [{ unique: true, fields: ['publicAddress'] }]
    }
  )

  // TODO associate relations

  return User
}
