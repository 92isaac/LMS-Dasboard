const express = require("express");
const { getSchedule } = require("../controller/scheduleController");
const router = express.Router();


router.get("/", getSchedule);



module.exports = router