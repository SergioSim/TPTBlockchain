const config   = require('./env.config.js'),
 outils        = require('./outils.js'),
 sql           = require('./sql.js'),
 express       = require('express'),
 fs            = require('fs'),
 https         = require('https'),
 bodyParser    = require('body-parser'),
 util          = require('util'),
 jwt           = require('jsonwebtoken'),
 mysql         = require('mysql'),
 helmet        = require('helmet'),
 crypto        = require('crypto'),
 openchain     = require("openchain"),
 bitcore       = require("bitcore-lib"),
 { check, validationResult } = require('express-validator/check');

const key  = fs.readFileSync('private.key'),
 cert      = fs.readFileSync('tptblockchain.crt' ),
 options   = {key: key, cert: cert};

const app  = express()
 server    = https.createServer(options, app),
 conn      = mysql.createConnection({host: config.mySqlHost , user: config.mySqlUser, password: config.mySqlPass});

const openchainValCli = new openchain.ApiClient(config.openchainValidator);

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    console.log("[REQUEST] " + req.url + " : " + util.inspect(req.body, {showHidden: false, depth: null}));
    next();
});

server.listen(config.port);
console.log("Serveur lancé sur le port : " + config.port);

openchainValCli.initialize().then( function(res) {
    console.log("Openchain initialized: " + openchainValCli.namespace.toHex());
});

app.get('/clients', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.BANQUE),
    check('banque').isAlphanumeric().escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {
    
    if(req.jwt.Banque !== req.query.banque && req.jwt.PermissionLevel !== config.permissionLevels.ADMIN)
        return res.status(403).send();
    conn.query(sql.findClientsByBanque_5_1, [req.query.banque], function(err, result){
        res.send((err) ? "Error" : result);
    });
});

app.get('/allClients', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN)], 
    function(req, res) {

    conn.query(sql.getAllClients_5_0, function(err, result){
        res.send((err) ? "Error" : result);
    });
});

app.post('/createBank', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN),
    check('name').isAlphanumeric().escape().trim(),
    outils.handleValidationResult],
    function(req, res) {
    
    conn.query(sql.insertBanque_0_3, [req.body.name], function(err, result) { 
        return res.send({success: !err});
    });
});

app.post('/createClient', [
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 5 }).escape(),
    check('banque').isLength({ min: 1 }).isAlphanumeric().escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {

    // create private key and store it ...
    const hdPrivateKey = new bitcore.HDPrivateKey();
    const address = hdPrivateKey.publicKey.toAddress().toString();
    let privateKey = hdPrivateKey.toString();
    console.log("plein private key:" + privateKey);  // IT'S VERY SAFE TO LOG  CLIENTS PRIVATE KEY!!!
    console.log("public key:" + address);
    privateKey = outils.encryptAES(privateKey, outils.getKeyFromPassword(req.body.password));
    console.log("encrypted private key:");
    console.log(privateKey);
    req.body.password = outils.hashPassword(req.body.password);
    conn.query(sql.insertClient_0_5, [req.body.email, req.body.password, privateKey, address, req.body.banque], function(err, result) {
        return res.send({success: !err});
    });
});

app.post('/createContact', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('email').isEmail().normalizeEmail(),
    check('nom').isLength({ min: 1 }).escape(),
    check('prenom').isLength({ min: 1 }).escape(),
    outils.handleValidationResult], 
    function(req, res) {

    conn.query(sql.insertContact_0_4, [req.jwt.Email, req.body.email, req.body.nom, req.body.prenom], function(err, result){
        return res.send({ succes: !err});
    });
});

app.delete('/deleteContact', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('email').isEmail().normalizeEmail(),
    outils.handleValidationResult], 
    function(req, res) {

    conn.query(sql.deleteContact_0_2, [req.jwt.Email, req.body.email], function(err, result){
		return res.send({ succes: !err && result.affectedRows != 0});
	});
});

app.post('/submit', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 5 }).escape(),
    check('montant').isNumeric().isLength({min: 1}),
    check('memo').optional().isAlphanumeric().escape(),
    outils.handleValidationResult], 
    function(req, res) {
    
    conn.query(sql.findClientByEmail_2_1, [req.body.email], function(err, result){
        if(err || !result[0]) return res.status(404).send({ succes: false, errors: ["user not found!"] });
        const publicKey = "/p2pkh/" + req.jwt.Address + "/";
        const untoAddress = "/p2pkh/" + result[0].Address + "/";
        console.log("[INFO]: fromAddress : " + publicKey);
        console.log("[INFO]: untoAddress : " + untoAddress);
        conn.query(sql.findClientByEmail_4_1, [req.jwt.Email], function(err2, result2){
            if(err2 || !result2[0]) return res.status(404).send({ succes: false, errors: ["you are a ghost!"] });
            req.transactionWallet = result2[0].Wallet;
            req.fromAddress = publicKey;
            req.untoAddress = untoAddress;
            return outils.transaction(req, res, openchainValCli);
        });
    });
});
  
app.post('/issueDHTG', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN),
    check('password').isLength({ min: 5 }).escape(),
    check('montant').isNumeric().isLength({min: 1}),
    check('memo').optional().isAlphanumeric().escape(),
    outils.handleValidationResult], 
    function(req, res) {

    conn.query(sql.findClientByEmail_4_1, [req.jwt.Email], function(err, result){
        if(err || !result[0]) {
            console.error("Email not found in db : " + req.jwt.Email);
            return res.status(404).send({ succes: false, errors: ["you are a ghost!"] });
        }
        req.transactionWallet = result[0].Wallet;
        req.fromAddress = config.DHTGAssetPath;
        req.untoAddress = "/p2pkh/" + req.jwt.Address + "/";
        console.log("unto: " + req.untoAddress);
        return outils.transaction(req, res, openchainValCli);
    });
});

app.post('/auth', [ 
    check('email').isEmail().normalizeEmail(), 
    check('password').isLength({ min: 5 }).escape(),
    outils.handleValidationResult
    ], function(req, res) {

    conn.query(sql.findClientByEmail_4_1, [req.body.email], function(err, result){
        if(!err && result[0]){
            result = result[0];
            let passwordFields = result.Password.split('$');
            let salt = passwordFields[0];
            let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
            if (hash === passwordFields[1]) {
                try {
                    let refreshId = req.body.email + config.jwt_secret;
                    let salt = crypto.randomBytes(16).toString('base64');
                    let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
                    aSecret = {};
                    aSecret.Email = req.body.email;
                    aSecret.PermissionLevel = result.PermissionLevel;
                    aSecret.Banque = result.Banque;
                    aSecret.Address = result.Address;
                    aSecret.refreshKey = salt;
                    let token = jwt.sign(aSecret, config.jwt_secret, { expiresIn: config.jwt_expiration_in_seconds});
                    let b = Buffer.from(hash);
                    let refresh_token = b.toString('base64');
                    return res.status(201).send({accessToken: token, refreshToken: refresh_token, address: result.Address});
                } catch (err) {
                    return res.status(500).send({errors: err});
                }
            }
        }
        return res.status(400).send({errors: ['Invalid e-mail or password']});
    });
});