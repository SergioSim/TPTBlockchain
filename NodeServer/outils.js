const jwt = require('jsonwebtoken'),
    config = require('./env.config.js'),
    util = require('util'),
    { check, validationResult } = require('express-validator/check');

exports.handleValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
  next();
}

exports.validJWTNeeded = (req, res, next) => {
  if (req.headers['authorization']) {
      try {
          let authorization = req.headers['authorization'].split(' ');
          if (authorization[0] !== 'Bearer') {
              return res.status(401).send();
          } else {
              req.jwt = jwt.verify(authorization[1], config.jwt_secret);
              console.log("check the value of jwt: " + util.inspect(req.jwt, {showHidden: false, depth: null}));
              return next();
          }
      } catch (err) {
          return res.status(403).send();
      }
  } else {
      return res.status(401).send();
  }
}; 

exports.minimumPermissionLevelRequired = (required_permission_level) => {
  return (req, res, next) => {
      let user_permission_level = req.jwt.PermissionLevel;
      if (user_permission_level >= required_permission_level) {
          return next();
      } else {
          return res.status(403).send();
      }
  };
};