const LibraryTransaction = require('../models/libraryTransactionModel');
const Book = require('../models/bookModel');
const User = require('../models/userModel');
const mongoose = require('mongoose')

// Get all transactions
const getAllTransactions = async () => {
  try {
    return await LibraryTransaction.find();
  } catch (error) {
    throw error;
  }
};

// Get a specific transaction by ID
const getTransactionById = async (id) => {
  try {
    return await LibraryTransaction.findById(id);
  } catch (error) {
    throw error;
  }
};

const getTransactionsByUser = async (username) => {
  try {
    // get transactions by user
    const user = await User.findOne({ username })
    console.log("userrr", user)
    const transactions = await LibraryTransaction.find({ user: user._id }).populate('book', 'name author');

    return transactions;
  } catch (error) {
    throw error;
  }
};

// handle book issue and return in same function
// Function to handle book transactions (issue or return)
// const handleBookTransaction = async (userId, bookId, transactionType) => {
//     try {
//       const book = await Book.findById(bookId);
//       if (!book) {
//         throw new Error('Book not found');
//       }

//       const existingTransaction = await LibraryTransaction.findOne({
//         user: userId,
//         book: bookId,
//         transactionType: 'issued',
//       });

//       if (transactionType === 'issue') {
//         // Issuing a book
//         if (!book || book.currentAvailabilityStatus !== 'available') {
//           throw new Error('Book not available for issuance');
//         }

//         book.currentAvailabilityStatus = 'issued';
//       } else if (transactionType === 'return') {
//         // Returning a book
//         if (!existingTransaction) {
//           throw new Error('User has not issued this book');
//         }

//         book.currentAvailabilityStatus = 'available';
//         existingTransaction.dueDate = new Date(); // Set the due date to the current date to mark it as returned
//         existingTransaction.transactionType = 'returned';
//         await existingTransaction.save();
//       } else {
//         throw new Error('Invalid transaction type');
//       }

//       await book.save();

//       const transaction = new LibraryTransaction({
//         user: userId,
//         book: bookId,
//         dueDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000), // Assuming a 14-day due period
//         transactionType: transactionType,
//       });

//       await transaction.save();

//       return { success: true, message: `Book ${transactionType === 'issue' ? 'issued' : 'returned'} successfully` };
//     } catch (error) {
//       throw error;
//     }
//   };



// Function to issue a book
const issueBook = async (userId, bookId) => {
  try {
    const book = await Book.findById(bookId);
    if (!book || book.status !== 'available') {
      throw new Error('Book not available for issuance');
    }

    // Update book availability status
    book.status = 'issued';
    await book.save();

    // Record the transaction
    const transaction = new LibraryTransaction({
      user: new mongoose.Types.ObjectId(userId),
      book: new mongoose.Types.ObjectId(bookId),
      dueDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000), // Assuming a 14-day due period
      transactionType: 'borrowed',
    });

    const user = await User.findById(new mongoose.Types.ObjectId(userId)).select('-password')
    user.transactions.push(transaction)
    await user.save()
    await transaction.save();

    return { success: true, message: 'Book issued successfully' };
  } catch (error) {
    console.log(error)
    throw error;
  }
};

// Function to return a book
const returnBook = async (bookId) => {
  console.log('bookId', bookId)
  try {
    // Check if the user has issued the book
    const transaction = await LibraryTransaction.findOne(
      { book: new mongoose.Types.ObjectId(bookId) }
      // transactionType: 'borrowed',
    )

    if (!transaction) {
      throw new Error('User has not issued this book');
    }

    // Update book availability status
    const book = await Book.findById(bookId);
    book.status = 'available';
    await book.save();

    // Record the return transaction
    transaction.dueDate = new Date(); // Set the due date to the current date to mark it as returned
    transaction.transactionType = 'returned';
    await transaction.save();


    const user = await User.findById(transaction.user)
    user.transactions.push(transaction)
    await user.save()

    return { success: true, message: 'Book returned successfully' };
  } catch (error) {
    console.log(error)
    throw error;
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  returnBook,
  issueBook,
  getTransactionsByUser
  //   handleBookTransaction
};
