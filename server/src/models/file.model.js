const { FILE_STATUSES } = require('../helpers/enums')
module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define(
    'File',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      ownerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'User',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cid: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      status: {
        type: DataTypes.ENUM,
        values: Object.values(FILE_STATUSES),
        defaultValue: FILE_STATUSES.draft
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
    }
  )

  File.associate = models => {
    models.File.belongsTo(models.User, {
      sourceKey: 'ownerId',
      targetKey: 'id',
      as: 'owner'
    })
  }

  return File
}
