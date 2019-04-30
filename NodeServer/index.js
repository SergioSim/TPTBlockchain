const express       = require('express');
const fs            = require('fs');
const https          = require('https');
const bodyParser    = require('body-parser');
const util          = require('util');
const jwt           = require('jsonwebtoken');
const mysql         = require('mysql');

const key       = fs.readFileSync('private.key');
const cert      = fs.readFileSync('tptblockchain.crt' );
const options   = {key: key, cert: cert};

const app       = express();
const server    = https.createServer(options, app);
const port      = 8086;
const conn      = mysql.createConnection({host: "82.255.166.104", user: "OpenchainUser", password: "OpenchainUserPassword13?"});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
        console.log("[REQUEST] " + req.url + " : " + util.inspect(req.body, {showHidden: false, depth: null}));
        next();
});

server.listen(port);
console.log("Serveur lancé sur le port : " + port);

app.get('/', function(req,res) {
    res.send(JSON.stringify({"Hello":"World", "test":"test"})); 
});

app.get('/clients', function(req, res) {
    conn.query("SELECT Login, Email, Address, Nom, Prenom, Banque FROM OpenchainUser.Client", function(err, result){
        res.send((err) ? "Error" : result);
    });
});

// don't foget to sanitise if needed:
// check('name').isLength({ min: 3 }).trim().escape(),
// check('email').isEmail().normalizeEmail(),
// check('age').isNumeric().trim().escape()