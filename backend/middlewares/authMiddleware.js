const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { sql } = require("../config/db");



const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Connect to SQL Server
        const pool = await sql.connect();

        // Query to get the user from SQL Server using the decoded user ID
        const result = await pool.request()
          .input('id', sql.UniqueIdentifier, decoded.id)
          .query('SELECT * FROM Users WHERE id = @id');

        const user = result.recordset[0]; // Assuming one user is returned

        if (user) {
          req.user = user; // Attach user information to request object
          next();
        } else {
          throw new Error('User not found');
        }
      }
    } catch (err) {
      throw new Error("Not Authorized, token expired, Please login again");
    }
  } else {
    throw new Error("There is no token attached to the header");
  }
});

// Middleware to check if the user is an admin
const isAdmin = asyncHandler(async (req, res, next) => {
  // Check if the user object exists
  if (!req.user || !req.user.email) {
    return res.status(401).json({ message: 'Not authorized, no user found' });
  }

  const { email } = req.user;

  // Connect to SQL Server
  const pool = await sql.connect();

  // Query to get the user by email
  const result = await pool.request()
    .input('email', sql.NVarChar, email)
    .query('SELECT role FROM Users WHERE email = @email');

  const adminUser = result.recordset[0];

  if (!adminUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (adminUser.role !== 'Admin') {
    return res.status(403).json({ message: "You are not an admin" });
  }

  // If the user is an admin, proceed to the next middleware
  next();
});


module.exports = { authMiddleware, isAdmin };
