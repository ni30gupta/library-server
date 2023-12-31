// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware to parse incoming request bodies
app.use(bodyParser.json());

// Enable Cross-Origin Resource Sharing
app.use(cors());
// Example middleware to enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check if MongoDB connection is successful
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define routes (replace with your actual routes)
const booksRoutes = require('./routes/books');
const usersRoutes = require('./routes/users');
const transactionsRoutes = require('./routes/transactions');

// Use the defined routes
app.use('/api/books', booksRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/transactions', transactionsRoutes);


// Set up the server to listen on a port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
