/**
 * Authentication Controller
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Requirement Traceability: IPR-F-001, IPR-F-002, IPR-SR-002, TC-Auth-01, TC-Auth-02
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// In-memory fallback store if MongoDB is not connected during isolated unit testing
const inMemoryUsers = new Map();

/**
 * Helper to get User model (if mongoose is available) or use in-memory store
 */
const getUserModel = () => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      return mongoose.model('User');
    }
  } catch (e) {
    // MongoDB model not active, fallback to in-memory store
  }
  return null;
};

/**
 * Helper to generate JWT token with standard payload
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

/**
 * Register User (Student / Recruiter / Admin)
 * Endpoint: POST /api/auth/register
 * Traceability: IPR-F-001 / TC-Auth-01
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role, department, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
        statusCode: 400
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format.',
        statusCode: 400
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
        statusCode: 400
      });
    }

    const assignedRole = role ? role.toLowerCase() : 'student';
    const validRoles = ['student', 'recruiter', 'admin'];
    if (!validRoles.includes(assignedRole)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role specified. Must be one of: ${validRoles.join(', ')}`,
        statusCode: 400
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const UserModel = getUserModel();

    if (UserModel) {
      // Check existing user in MongoDB
      const existingUser = await UserModel.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.',
          statusCode: 409
        });
      }

      // Hash password using salted adaptive hashing (IPR-SR-002)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new UserModel({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: assignedRole,
        department: department || '',
        phone: phone || ''
      });

      await newUser.save();
      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        statusCode: 201,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department
        }
      });
    } else {
      // In-memory mode for isolated testing
      if (inMemoryUsers.has(normalizedEmail)) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.',
          statusCode: 409
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const id = 'user_' + Date.now() + Math.random().toString(36).substr(2, 5);

      const userRecord = {
        id,
        _id: id,
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: assignedRole,
        department: department || '',
        phone: phone || '',
        createdAt: new Date()
      };

      inMemoryUsers.set(normalizedEmail, userRecord);
      const token = generateToken(userRecord);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully (in-memory mode).',
        statusCode: 201,
        token,
        user: {
          id: userRecord.id,
          name: userRecord.name,
          email: userRecord.email,
          role: userRecord.role,
          department: userRecord.department
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration.',
      statusCode: 500,
      error: error.message
    });
  }
};

/**
 * User Login
 * Endpoint: POST /api/auth/login
 * Traceability: IPR-F-002 / TC-Auth-02
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
        statusCode: 400
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const UserModel = getUserModel();
    let user = null;

    if (UserModel) {
      user = await UserModel.findOne({ email: normalizedEmail });
    } else {
      user = inMemoryUsers.get(normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        statusCode: 401
      });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        statusCode: 401
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      statusCode: 200,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
      statusCode: 500,
      error: error.message
    });
  }
};

/**
 * Get Current Authenticated User Profile
 * Endpoint: GET /api/auth/me
 * Traceability: IPR-SR-001, TC-Auth-02
 */
const getMe = async (req, res) => {
  try {
    const UserModel = getUserModel();
    let user = null;

    if (UserModel) {
      user = await UserModel.findById(req.user.id).select('-password');
    } else {
      user = inMemoryUsers.get(req.user.email);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
        statusCode: 404
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile.',
      statusCode: 500,
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  inMemoryUsers
};
