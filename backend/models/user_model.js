module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    PasswordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Role: {
      type: DataTypes.ENUM('Admin', 'Instructor', 'Student'),
      allowNull: false
    },
    ProfileImageUrl: {
      type: DataTypes.STRING
    },
    CreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true,
    tableName: 'Users'
  });

  return User;
};
