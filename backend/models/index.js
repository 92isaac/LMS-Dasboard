const User = require("./user_model");
const Instructor = require("./instructor_model");
const Student = require("./student_model");
const Course = require("./course_model");
const Schedule = require("./schedule_model");
const Admission = require("./admission_model");
const File = require("./file_model");

// Define relationships
User.hasOne(Instructor, { foreignKey: "InstructorID" });
User.hasOne(Student, { foreignKey: "StudentID" });

Instructor.hasMany(Course, { foreignKey: "InstructorID" });
Course.hasMany(Schedule, { foreignKey: "CourseID" });
Student.hasMany(Admission, { foreignKey: "StudentID" });
User.hasMany(File, { foreignKey: "UserID" });

module.exports = {
  User,
  Instructor,
  Student,
  Course,
  Schedule,
  Admission,
  File,
};
