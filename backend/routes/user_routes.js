const express = require("express");
const { getAllUser, getAllStudentOnly, getAllInstructors } = require("../controller/userController");
const router = express.Router();


router.get('/', getAllUser);
router.get('/students', getAllStudentOnly)
router.get('/instructors', getAllInstructors)



module.exports = router