module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    ScheduleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    CourseID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Courses',
        key: 'CourseID'
      }
    },
    InstructorID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Instructors',
        key: 'InstructorID'
      }
    },
    TimeSlot: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Classroom: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: true,
    tableName: 'Schedules'
  });

  return Schedule;
};
