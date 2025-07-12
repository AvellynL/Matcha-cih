const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register new user
exports.registerUser = async (req, res) => {
  const { username, name, address, password, email } = req.body;

  if (!username || !name || !address || !password || !email) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({
      username,
      name,
      address,
      password,
      email,
    });

    await user.save();

    res.status(201).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      address: user.address,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Login user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        name: user.name,
        address: user.address,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout user (client-side token removal)
exports.logoutUser = async (req, res) => {
  // Since JWT is stateless, logout is handled on client by deleting token
  res.json({ message: 'User logged out' });
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
