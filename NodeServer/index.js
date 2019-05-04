const config   = require('./env.config.js'),
 outils        = require('./outils.js'),
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
 conn      = mysql.createConnection({host: "82.255.166.104", user: "OpenchainUser", password: "OpenchainUserPassword13?"});

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

//ROUTES
app.get('/', function(req,res) {
    res.send(JSON.stringify({"Hello":"World", "test":"test"})); 
});

app.get('/clients', [outils.validJWTNeeded, outils.minimumPermissionLevelRequired(config.permissionLevels.BANQUE)], function(req, res) {
    conn.query("SELECT Email, Address, Nom, Prenom, Banque FROM OpenchainUser.Client", function(err, result){
        res.send((err) ? "Error" : result);
    });
});

app.post('/createClient', function(req, res) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
    console.log(req.body.password);
    const aQuery ="INSERT INTO OpenchainUser.Client  (Email, Password, Wallet, Address, Banque) VALUES (?,?,?,?,?)";
    conn.query(aQuery, [req.body.email, req.body.password, req.body.wallet, req.body.address, req.body.banque], 
	function(err, result) {
        return res.send(result);
	});
});

app.post('/auth', [ 
    check('email').isEmail().normalizeEmail(), 
    check('password').isLength({ min: 5 }).escape(),
    outils.handleValidationResult
    ], function(req, res) {

    const aQuery = "SELECT Password, Address, Wallet, PermissionLevel FROM OpenchainUser.Client WHERE Email LIKE BINARY ?";
    conn.query(aQuery, [req.body.email], function(err, result){
        console.log(result);
        if(!err){
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
                    aSecret.PermissionLevel = result.PermissionLevel;
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