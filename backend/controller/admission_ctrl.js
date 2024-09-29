const { sql } = require("../config/db");
const { formatResponse } = require("../utils/responseFormatter");


const getAdmission =(req, res)=>{
  const q = 'SELECT * FROM Admissions'
 try{
  sql.query(q, (err, data)=>{
    res.json(formatResponse(data))
  });
 }catch(e){
   console.log(e)
   res.status(500).json({error: 'Failed to get admisson table'})
   throw new Error(error);
 }
}


module.exports = {
  getAdmission
}