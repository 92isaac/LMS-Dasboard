const express = require("express");
const {
  getAllUser,
  getAllStudentOnly,
  getAllInstructors,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  loginUserCtrl,
} = require("../controller/userController");
const { authMiddleware, isAdmin} = require("../middlewares/authMiddleware")
const router = express.Router();

router.post("/sign-in", loginUserCtrl);
router.get("/", getAllUser);
router.post("/", isAdmin, createUser);
router.patch("/update/:id", authMiddleware, updateUser);
router.delete("/delete/:id", isAdmin,  deleteUser);
router.get("/by/:id", getSingleUser);
router.get("/students", isAdmin, getAllStudentOnly);
router.get("/instructors", isAdmin, getAllInstructors);

module.exports = router;