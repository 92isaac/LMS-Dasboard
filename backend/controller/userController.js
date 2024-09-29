const { sql } = require("../config/db");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const { formatResponse } = require("../utils/responseFormatter");
const { generateToken, generateRefreshToken } = require("../config/generateToken");

// Get all users
const getAllUser = asyncHandler(async (req, res) => {
  const q = 'SELECT * FROM users';
  try {
    const result = await sql.query(q);
    res.json(formatResponse(result));
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
   throw new Error(err);
  }
});





// Fetch only students
const getAllStudentOnly =asyncHandler(async (req, res) => {
  const q = "SELECT * FROM users WHERE role = 'Student'"; 
  try {
    const result = await sql.query(q);
    res.json(formatResponse(result));
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
   throw new Error(err);
  }
});

// Fetch only instructors
const getAllInstructors = asyncHandler(async (req, res) => {
  const q = "SELECT * FROM users WHERE role = 'Instructor'";
  
  try {
    const result = await sql.query(q);
    res.json(formatResponse(result));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
   throw new Error(err);
  }
  // try {
  //   const pool = await sql.connect();  
  //   const result = await pool.request().query(q);
  //   console.log("Instructors query result: ", result);  
  //   res.json(formatResponse(result));
  // } catch (err) {
  //   console.error('Error in getAllInstructors:', err); 
  //   res.status(500).json({ error: 'Internal Server Error', details: err.message });
  // }
});


const createUser = asyncHandler(async (req, res) => {
  const userId = uuidv4();

  const { name, email, password, role, profileImageUrl } = req.body;

  const q = `
    INSERT INTO users (id, name, email, password, role, profileImageUrl) 
    VALUES (@id, @name, @email, @password, @role, @profileImageUrl);
  `;

  try {
    const pool = await sql.connect();
    const request = pool.request();

   
    request.input('id', sql.UniqueIdentifier, userId);
    request.input('name', sql.NVarChar, name);
    request.input('email', sql.NVarChar, email);
    request.input('password', sql.NVarChar, password);
    request.input('role', sql.NVarChar, role);  
    request.input('profileImageUrl', sql.NVarChar, profileImageUrl || null); 

    await request.query(q);

    res.status(201).json({ message: 'User created successfully', userId });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
    throw new Error(err);
  }
});


const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { PasswordHash, ProfileImageUrl } = req.body;

  // SQL query to update only the password and profile image
  const q = `
    UPDATE users 
    SET PasswordHash = @password, profileImageUrl = @profileImageUrl
    WHERE id = @id;
  `;

  try {
    const pool = await sql.connect();
    const request = pool.request();

    request.input('id', sql.UniqueIdentifier, id); 
    request.input('password', sql.NVarChar, PasswordHash || null); 
    request.input('profileImageUrl', sql.NVarChar, ProfileImageUrl || null); 

    const result = await request.query(q);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
   throw new Error(err);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // SQL query to delete the user by UserID
  const q = `
    DELETE FROM users
    WHERE id = @id;
  `;

  try {
    // Establish a connection pool and create a request
    const pool = await sql.connect();
    const request = pool.request();

    // Bind the UserID parameter to the query
    request.input('id', sql.UniqueIdentifier, id);

    // Execute the query
    const result = await request.query(q);

    // Check if a row was affected (i.e., user was deleted)
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send success response
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    // Handle errors and return appropriate response
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
   throw new Error(err);
  }
});


const getSingleUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const q = 'SELECT * FROM users WHERE id = @id'; 
console.log(id)
  try {
    const validatedId = id.toUpperCase();
    const pool = await sql.connect(); 
    const request = pool.request();
    request.input('id', sql.UniqueIdentifier, validatedId);

    const result = await request.query(q);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found or does not exist', data:[] });
    }
    res.json(formatResponse(result));
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  //  throw new Error(err);
  }
});



// Define the login controller using SQL instead of MongoDB
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Establish connection to SQL Server
    const pool = await sql.connect(/* SQL Server config */);

    // 2. Query to check if the user exists
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM users WHERE email = @email');

    const findUser = result.recordset[0]; // Get the user from the result
    console.log(findUser)

    // 3. If user exists, check if the password matches
    if (findUser && await bcrypt.compare(password, findUser.password) || findUser && findUser.password) {
      // 4. Generate refresh token
      const refreshToken = await generateRefreshToken(findUser.id);

      // 5. Update the user's refresh token in the database
      await pool.request()
        .input('refreshToken', sql.NVarChar, refreshToken)
        .input('id', sql.UniqueIdentifier, findUser.id)
        .query('UPDATE users SET refreshToken = @refreshToken WHERE id = @id');

      // 6. Set the refresh token as a cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000, // 3 days
      });

      // 7. Return the user data and token
      res.json({
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
        token: generateToken(findUser.id), // Generate access token
      });
    } else {
      // 8. If the user is not found or password doesn't match, throw an error
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = {
  getAllUser,
  getAllStudentOnly,
  getAllInstructors,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  loginUserCtrl
 
};
