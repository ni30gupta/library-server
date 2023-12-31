// routes/transactionRoutes.js

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  console.log(req.path, req.originalUrl)
  const bearerHeader = req.headers['authorization'];

  if (bearerHeader) {
    const token = bearerHeader.split(' ')[1];
    console.log('token...', token)

    jwt.verify(token, process.env.jwt_key, (err, decoded) => {
      if (err) {
        res.status(403).json({ error: 'Token Invalid!' });
      } else {
        req.user = decoded; // Store user information in the request object
        if (decoded.role === 'admin' || req.originalUrl.includes('transactions/all')) {
          // User is an admin
          next();
        } else {
          res.status(403).json({ error: 'User does not have admin privileges!' });
        }
      }
    });
  } else {
    res.status(401).json({ error: 'Token not provided!' });
  }
};



// Route to issue a book
router.post('/issue', verifyToken, async (req, res) => {
  try {
    const result = await transactionController.issueBook(req.body.userId, req.body.bookId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error issuing book' });
  }
});

// Route to return a book
router.post('/return', verifyToken, async (req, res) => {
  try {
    const result = await transactionController.returnBook(req.body.bookId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error returning book' });
  }
});

// router.get('/all', verifyToken, async (req, res) => {
//   try {

//     const result = await transactionController.getAllTransactions()
//     res.json(result)
//   } catch (error) {
//     res.status(500).json({ error: 'Error returning book list' });

//     console.log(error)

//   }
// })


router.get('/all', verifyToken, async (req, res) => {
  try {
    const user_role = req.user.role;
    console.log("first...", req.user)
    let result;
    if (user_role=='user') {
      // If user has role not admin get the username from req.user
      result = await transactionController.getTransactionsByUser(req.user.username);
    } else {
      // for admin - get all transactions
      result = await transactionController.getAllTransactions();
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
    console.error(error);
  }
});

module.exports = router;
