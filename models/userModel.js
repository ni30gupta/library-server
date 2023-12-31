const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contactNumber: {
    type: String,
  },
  role:{
    type:String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password:{
    type:String,
    required:true
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LibraryTransaction',
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
