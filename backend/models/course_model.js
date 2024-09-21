module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    CourseID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    CourseName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Department: {
      type: DataTypes.STRING,
      allowNull: false
    },
    InstructorID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Instructors',
        key: 'InstructorID'
      }
    },
    CreditHours: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: true,
    tableName: 'Courses'
  });

  return Course;
};
