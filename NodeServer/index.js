const express     = require('express');
const http        = require('http');
const bodyParser  = require('body-parser');
const util        = require('util')

const app     = express();
const server 	= http.Server(app);
const port    = process.env.PORT || 8086;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
server.listen(port);

console.log("Serveur lancé sur le port : " + port);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
});

app.get('/',function(req,res) {
    console.log("/: " + util.inspect(req.query, {showHidden: false, depth: null}));
    res.send(JSON.stringify({"Hello":"World", "test":"test"})); 
});