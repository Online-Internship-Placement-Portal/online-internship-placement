/**
 * Authentication Controller (Sprint-2)
 * Author: Sohel Mahibubasa Chapparband (PES2UG25CS826)
 * Role: Authentication and Integration
 * Traceability: IPR-F-001, IPR-F-002, IPR-SR-002, TC-Auth-01, TC-Auth-02
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// In-memory fallback store if MongoDB is not connected during isolated unit testing
const inMemoryUsers = new Map();

// Pre-populate standard demo accounts (STP Section 6)
const studentHash = bcrypt.hashSync('Password123', 10);
const recruiterHash = bcrypt.hashSync('RecruiterPass123', 10);
const adminHash = bcrypt.hashSync('AdminPass123', 10);

inMemoryUsers.set('sohel@pes.edu', {
  id: 'usr_student_01',
  _id: 'usr_student_01',
  name: 'Sohel Mahibubasa Chapparband',
  email: 'sohel@pes.edu',
  password: studentHash,
  role: 'student',
  department: 'Computer Science and Engineering',
  phone: '+91-9876543210'
});

inMemoryUsers.set('navya@pes.edu', {
  id: 'usr_student_02',
  _id: 'usr_student_02',
  name: 'Navya R',
  email: 'navya@pes.edu',
  password: studentHash,
  role: 'student',
  department: 'Computer Science and Engineering',
  phone: '+91-9876543211'
});

inMemoryUsers.set('recruiter@google.com', {
  id: 'usr_recruiter_01',
  _id: 'usr_recruiter_01',
  name: 'Google Campus Recruiter',
  email: 'recruiter@google.com',
  password: recruiterHash,
  role: 'recruiter',
  department: 'Talent Acquisition',
  phone: '+91-9876543212'
});

inMemoryUsers.set('admin@pes.edu', {
  id: 'usr_admin_01',
  _id: 'usr_admin_01',
  name: 'Placement Admin PES',
  email: 'admin@pes.edu',
  password: adminHash,
  role: 'admin',
  department: 'Placement Cell',
  phone: '+91-9876543213'
});

const getUserModel = () => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        return mongoose.model('User');
      } catch (e) {
        return require('../../dheeraj/models/User');
      }
    }
  } catch (e) {}
  return null;
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      department: user.department
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
        department: department || 'Computer Science and Engineering',
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
    }

    // In-memory fallback
    if (inMemoryUsers.has(normalizedEmail)) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
        statusCode: 409
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRecord = {
      id: `usr_${Date.now()}`,
      _id: `usr_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: assignedRole,
      department: department || 'Computer Science and Engineering',
      phone: phone || ''
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
    }

    if (!user) {
      user = inMemoryUsers.get(normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
        statusCode: 401
      });
    }

    // Verify salted adaptive bcrypt password hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
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
 * Get Authenticated User Identity
 * Endpoint: GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated.' });
    }
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  inMemoryUsers
};
