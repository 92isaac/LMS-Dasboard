const PORT = process.env.DB_PORT || 4000
const express = require('express');
require("dotenv").config()
const userRoutes = require('./routes/user_routes')
const scheduleRoutes = require('./routes/schedule_routes')
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const { notFound, errorhandler } = require('./middlewares/error_handler');
const app = express();
const { connect, sql } = require('./config/db.js');



app.use(cors());
app.use(morgan('dev'))
app.use(cookieParser());
app.use(express.json());


connect()
.then((connection)=>{
  console.log("Connected to the database");
})
.catch((error)=>{
  console.log("Database connection erorr ")
  console.log(error);
});


app.use('/api/user', userRoutes)
app.use('/api/schedule', scheduleRoutes)

app.use(notFound)
app.use(errorhandler)
app.listen(PORT, ()=>{
    console.log(`Server is listening on ${PORT}`)
})
