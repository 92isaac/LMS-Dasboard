module.exports = (sequelize, DataTypes) => {
  const Admission = sequelize.define('Admission', {
    AdmissionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    StudentID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Students',
        key: 'StudentID'
      }
    },
    CourseApplied: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'Admissions'
  });

  return Admission;
};
