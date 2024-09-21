const { sql } = require("../config/db");


const getSchedule =(req, res)=>{
  const q = 'SELECT * FROM Schedules'
 try{
  sql.query(q, (err, data)=>{
    res.json(data)
  });
 }catch(e){
   console.log(e)
   res.status(500).json({error: 'Failed to get schedule'})
   throw new Error(error);
 }
}


module.exports = {
  getSchedule
}