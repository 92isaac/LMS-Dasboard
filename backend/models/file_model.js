module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    FileID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'UserID'
      }
    },
    FileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    FileType: {
      type: DataTypes.STRING
    },
    UploadedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true,
    tableName: 'Files'
  });

  return File;
};
