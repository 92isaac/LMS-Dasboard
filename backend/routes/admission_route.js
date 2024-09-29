const express = require("express");
const { getAdmission } = require("../controller/admission_ctrl");
const router = express.Router();


router.get("/", getAdmission);



module.exports = router