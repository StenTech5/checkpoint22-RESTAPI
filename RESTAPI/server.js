// Import required modules
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();  // To use .env file

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());  // To parse incoming JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Import the User model
const User = require('./models/User');

// GET route: Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Find all users in the database
    res.json(users); // Send the users as a response
  } catch (err) {
    res.status(500).send('Error retrieving users');
  }
});

// POST route: Add a new user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = new User({ name, email });
    await newUser.save(); // Save the new user to the database
    res.status(201).json(newUser); // Send back the created user
  } catch (err) {
    res.status(400).send('Error adding user');
  }
});

// PUT route: Update a user by ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params; // Get the ID from the URL parameters
  const { name, email } = req.body; // Get the new data from the body
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });
    if (!updatedUser) {
      return res.status(404).send('User not found');
    }
    res.json(updatedUser); // Return the updated user
  } catch (err) {
    res.status(400).send('Error updating user');
  }
});

// DELETE route: Remove a user by ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params; // Get the ID from the URL parameters
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('User deleted');
  } catch (err) {
    res.status(500).send('Error deleting user');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
