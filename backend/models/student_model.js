module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    StudentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'UserID'
      }
    },
    EnrollmentDate: {
      type: DataTypes.DATE
    },
    Course: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'Students'
  });

  return Student;
};
