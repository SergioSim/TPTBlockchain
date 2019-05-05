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
 { check, validationResult } = require('express-validator/check');

const key  = fs.readFileSync('private.key'),
 cert      = fs.readFileSync('tptblockchain.crt' ),
 options   = {key: key, cert: cert};

const app  = express()
 server    = https.createServer(options, app),
 conn      = mysql.createConnection({host: config.mySqlHost , user: config.mySqlUser, password: config.mySqlPass});

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
    outils.handleValidationResult], 
    function(req, res) {

    req.body.password = outils.hashPassword(req.body.password);
    conn.query(sql.insertClient_0_5, [req.body.email, req.body.password, req.body.wallet, req.body.address, req.body.banque], function(err, result) {
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
                    aSecret.Banque = result.Banque
                    aSecret.refreshKey = salt;
                    let token = jwt.sign(aSecret, config.jwt_secret, { expiresIn: config.jwt_expiration_in_seconds});
                    let b = Buffer.from(hash);
                    let refresh_token = b.toString('base64');
                    return res.status(201).send({accessToken: token, refreshToken: refresh_token});
                } catch (err) {
                    return res.status(500).send({errors: err});
                }
            }
        }
        return res.status(400).send({errors: ['Invalid e-mail or password']});
    });
});