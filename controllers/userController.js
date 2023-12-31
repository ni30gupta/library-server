// controllers/userController.js

const User = require('../models/userModel');
const {hashPassword} = require('../config/auth') 

// Create a new user
const createUser = async (userData) => {
  try {
    const hashedPassword = await hashPassword(userData.password);

    const newUser = new User({
      ...userData,
      password: hashedPassword,

    });
    console.log(newUser)
    return await newUser.save();
  } catch (error) {
    console.log(error)
    throw error;
  }
};

// Get user details by username
const getUserByUsername = async (username) => {
  try {
    return await User.findOne({ username });
  } catch (error) {
    throw error;
  }
};

// Update user details by username
const updateUserByUsername = async (username, updatedDetails) => {
  try {
    return await User.findOneAndUpdate({ username }, updatedDetails, { new: true });
  } catch (error) {
    throw error;
  }
};

// Delete user by username
const deleteUserByUsername = async (username) => {
  try {
    return await User.findOneAndDelete({ username });
  } catch (error) {
    throw error;
  }
};

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
    next();
  });
};
    
    module.exports = {
      authenticateJWT,
      createUser,
      getUserByUsername,
      updateUserByUsername,
      deleteUserByUsername,
    };
    
