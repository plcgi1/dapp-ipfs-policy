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
