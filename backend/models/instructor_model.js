module.exports = (sequelize, DataTypes) => {
  const Instructor = sequelize.define('Instructor', {
    InstructorID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'UserID'
      }
    },
    Department: {
      type: DataTypes.STRING,
      allowNull: false
    },
    HireDate: {
      type: DataTypes.DATE
    }
  }, {
    timestamps: true,
    tableName: 'Instructors'
  });

  return Instructor;
};
