const jwt   = require('jsonwebtoken'),
 config     = require('./env.config.js'),
 crypto     = require('crypto'),
 openchain  = require("openchain"),
 bitcore    = require("bitcore-lib"),
 httpinvoke = require("httpinvoke"),
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

exports.fixPortefeuilles = (result) => {
    for (const i of result) {
        i.Portefeuille = i.Portefeuille.replace("},{", "}\n{");
        let aPortefeuillesResultat = [];
        let aPortefeuilles = i.Portefeuille.split("\n");
        for (const aPortefeuille of aPortefeuilles) {
            aPortefeuillesResultat.push(JSON.parse(aPortefeuille));
        }
        i.Portefeuille = aPortefeuillesResultat;
    }
}

exports.hashPassword = (password) => {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(password).digest("base64");
    return salt + "$" + hash;
};

exports.getKeyFromPassword = (password) => {
   return (password.substring(0, 16) + config.aes_secret).substring(0, 32);
};

exports.hasChanged = (inBody, inQuerry) => {
    return (inBody === undefined) ? ((inQuerry === undefined) ? '' : inQuerry) : inBody;
}

exports.generateEncryptedKeys = (password) => {
    const hdPrivateKey = new bitcore.HDPrivateKey();
    const address = hdPrivateKey.publicKey.toAddress().toString();
    let privateKey = hdPrivateKey.toString();
    console.log("plein private key:" + privateKey);  // IT'S VERY SAFE TO LOG  CLIENTS PRIVATE KEY!!!
    console.log("public key:" + address);
    privateKey = this.encryptAES(privateKey, this.getKeyFromPassword(password));
    console.log("encrypted private key:");
    console.log(privateKey);
    return {privateKey: privateKey, address: address};
}

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

exports.transaction = (req, res, openchainValCli) => {
    let decryptedHDK;
    try {
        decryptedHDK = this.decryptAES(req.transactionWallet, this.getKeyFromPassword(req.body.password));
    } catch(error) {
        console.log("[ERROR]: " + error);
        return res.status(400).send({ succes: false, errors: ["wrong password!"] });
    }
    console.log("decryptedHDK : " + decryptedHDK);
    if(!req.body.memo) req.body.memo = "";
    console.log(req.body.memo);
    const privateKey = bitcore.HDPrivateKey.fromString(decryptedHDK);
    const signer = new openchain.MutationSigner(privateKey);
    new openchain.TransactionBuilder(openchainValCli)
    .addSigningKey(signer)
    //.setMetadata({ "memo": req.body.memo })
    .updateAccountRecord(req.fromAddress, config.DHTGAssetPath, -req.body.montant)
    .then(function (transactionBuilder) {
        console.log("[INFO]: building transaction");
        return transactionBuilder.updateAccountRecord(req.untoAddress, config.DHTGAssetPath, req.body.montant);
    }).then(function (transactionBuilder) {
        // WHY ? : throw inside a Promise without a catch ...
        console.log("creating mutation and signatures");
        const mutation = transactionBuilder.build();
        const signatures = [];
        signatures.push({
            signature: transactionBuilder.keys[0].sign(mutation).toHex(),
            pub_key: transactionBuilder.keys[0].publicKey.toHex()
        });
        const url = config.openchainValidator + "submit";
        const body = JSON.stringify({ mutation: mutation.toHex(), signatures: signatures });
        console.log("[INFO]: Body:");
        console.log(body);
        httpinvoke(url, "POST", { input: body }).then( function(result) {
            console.log("got response:");
            console.log(result);
            if (result.statusCode != 200) {
                try {
                    result.data = JSON.parse(result.body);
                } catch (err) { }   
                return res.status(result.statusCode).send(result);
            } else {
                return res.send(JSON.parse(result.body));
            }
        });
    });
}