// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.jwt_key, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
    next();
  });
};



const hashPassword = async (plainPassword) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    console.log(hashedPassword)
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

module.exports ={ authenticateJWT,
    hashPassword
};
