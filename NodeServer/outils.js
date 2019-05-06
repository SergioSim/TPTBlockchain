const jwt   = require('jsonwebtoken'),
    config  = require('./env.config.js'),
    crypto  = require('crypto'),
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

exports.hashPassword = (password) => {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(password).digest("base64");
    return salt + "$" + hash;
};

exports.getKeyFromPassword = (password) => {
   return (password.substring(0, 16) + config.aes_secret).substring(0, 32);
};

exports.encryptAES = (text, ikey) => {
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ikey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + "$" + encrypted.toString('hex') 
};
   
exports.decryptAES = (text, ikey) => {
    let textFields = text.split('$');
    let iv = Buffer.from(textFields[0], 'hex');
    let encryptedText = Buffer.from(textFields[1], 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ikey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};