const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const keys = require('../config/keys');
const errorHandler = require('../routes/utils/errorHandler');

module.exports.login = async (req, res) => {
  const candidate = await User.findOne({
    email: req.body.user.email
  });
  if (candidate) {
    //check password
    const passwordResult = bcrypt.compareSync(req.body.user.password, candidate.password);
    if (passwordResult) {
      // generation token
      const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id
      }, keys.jwt, {
        expiresIn: 60 * 60
      });
      res.status(201).json({
        token,
      })
    } else {
      res.status(401).json({
        message: 'User un authorize.'
      })
    }
  } else {
    // user not found, alert
    res.status(404).json({
      message: 'user not found'
    })
  }
};

module.exports.register = async (req, res) => {
  //email password
  const candidate = await User.findOne({
    email: req.body.user.email
  });
  if (candidate) {
    //user use again
    res.status(409).json({
      message: 'such an email is already taken'
    })
  } else {
    // created user
    const user = new User({
      firstName: req.body.user.firstName,
      lastName: req.body.user.lastName,
      email: req.body.user.email,
      password: req.body.user.password,
    });
    try {
      await user.save();
      const token = jwt.sign({
        email: user.email,
        userId: user._id
      }, keys.jwt, {
        expiresIn: 60 * 60
      });
      res.status(201).json({
        token,
      })
    } catch (e) {
      errorHandler(res, e)
    }
  }
};

module.exports.getAll = async (req, res) => {
  try {
    const {token} = req.body
    const decoded = await jwt.verify(token, keys.jwt);
    //check user
    const candidate = await User.findOne({
      email: decoded.email
    });
    if (candidate.role === 1) {
      const users = await User.find();
      if (users) {
        res.status(201).json(users)
      } else {
        res.status(404).json({
          message: 'not found'
        })
      }
    } else {
      res.status(403).json({
        message: 'permission denied'
      })
    }
  } catch (err) {
    errorHandler(res, err)
  }
};

module.exports.get = async (req, res) => {
  try {
    const {token} = req.body
    const decoded = await jwt.verify(token, keys.jwt);
    //check user
    const candidate = await User.findOne({
      email: decoded.email
    });
    if (candidate) {
      //get user of email or yourself
      const user = await User.find({
        email: req.body.email ? req.body.email : decoded.email
      });
      if (user) {
        res.status(201).json(user)
      } else {
        res.status(404).json({
          message: 'not found'
        })
      }
    } else {
      res.status(403).json({
        message: 'permission denied'
      })
    }
  } catch (err) {
    errorHandler(res, err)
  }
};
