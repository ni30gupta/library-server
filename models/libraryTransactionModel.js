const mongoose = require('mongoose');

const libraryTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
    index:true
  },
  dueDate: {
    type: Date,
    required: true,
  },
  transactionType: {
    type: String,
    enum: ['borrowed', 'returned'],
    required: true,
  },
});

const LibraryTransaction = mongoose.model('LibraryTransaction', libraryTransactionSchema);

module.exports = LibraryTransaction;
