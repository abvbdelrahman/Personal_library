const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const signToken = id => {
    const payload = { id };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const createToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    });
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({ errors: [{ msg: 'You are not authorized to access this resource' }] });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id).select('-password');

    if (!currentUser) {
        return res.status(401).json({ errors: [{ msg: 'User no longer exists' }] });
    }

    req.user = currentUser;
    next();
});

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    createToken(newUser, 201, req, res);
  });

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ errors: [{ msg: 'Please provide email and password' }] });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(400).json({ errors: [{ msg: 'Invalid email or password' }] });
    }

    createToken(user, 200, req, res);
});


exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ status: 'success' });
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      // roles ['admin', 'lead-guide']. role='user'
      if (!roles.includes(req.user.role)) {
        return next(
          new Error('You do not have permission to perform this action', 403)
        );
      }
  
      next();
    };
  };