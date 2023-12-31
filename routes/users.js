const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const userController = require('../controllers/userController');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await userController.getUserByUsername(username);
    //   const hashed = await bcrypt.hash(password)
        
      if (!user || !bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ username: user.username, role: user.role }, process.env.jwt_key, { expiresIn: '11h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Error during login' });
    }
  });
// Create a new user
router.post('/', async (req, res) => {
  try {
    const newUser = await userController.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Get user details by username
router.get('/:identifier?', async (req, res) => {
  try {
    const identifier = req.params.identifier;

    if (identifier) {
      // If the identifier is provided, check if it's a valid ObjectId
      let user;

      if (mongoose.Types.ObjectId.isValid(identifier)) {
        // If the identifier is a valid ObjectId, query by userId
        user = await User.findById(identifier);
      } else {
        // If the identifier is not a valid ObjectId, query by username
        user = await User.findOne({ username: identifier });
      }

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } else {
      // If no identifier is provided, fetch all users
      const allUsers = await User.find();
      res.json(allUsers);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting user details' });
  }
});


// Update user details by username
router.put('/:username', async (req, res) => {
    console.log(req.params)

  try {
    const updatedUser = await userController.updateUserByUsername(req.params.username, req.body);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating user details' });
  }
});

// Delete user by username
router.delete('/:username', async (req, res) => {
  try {
    const deletedUser = await userController.deleteUserByUsername(req.params.username);
    if (deletedUser) {
      res.json(deletedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;























// // Get user details by ID
// const getUserById = async (id) => {
//   try {
//     return await User.findById(id);
//   } catch (error) {
//     throw error;
//   }
// };

// // Get user transaction history by ID
// const getUserTransactionHistory = async (id) => {
//   try {
//     const user = await User.findById(id).populate('transactions');
//     return user.transactions;
//   } catch (error) {
//     throw error;
//   }
// };

// module.exports = {
//   getUserById,
//   getUserTransactionHistory,
// };
