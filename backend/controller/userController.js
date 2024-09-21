const { sql } = require("../config/db");

const getAllUser =(req, res)=>{
  const q = 'SELECT * FROM users'
  sql.query(q, (err, data)=>{
    if(err) throw err;
    res.json(data)
  });
}

// Fetch only users where Role is 'Student'
const getAllStudentOnly =(req, res)=>{
  const q = "SELECT * FROM users WHERE Role = 'Student'"; 
  sql.query(q, (err, data) => {
    if (err) throw err;
    res.json(data);
  });
}
// Fetch only users where Role is 'Instructor'
const getAllInstructors =(req, res)=>{
  const q = "SELECT * FROM users WHERE Role = 'Instructor'"; 
  sql.query(q, (err, data) => {
    if (err) throw err;
    res.json(data);
  });
}

module.exports = {
  getAllUser,
  getAllStudentOnly,
  getAllInstructors
}
  