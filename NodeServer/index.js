const config   = require('./env.config.js'),
 outils        = require('./outils.js'),
 sql           = require('./sql.js'),
 bd            = require('./bd.js'),
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
 cryptoRandom  = require('crypto-random-string'),
 nodemailer    = require('nodemailer'),
 rateLimit     = require("express-rate-limit"),
 { check, validationResult } = require('express-validator/check');

const key  = fs.readFileSync('private.key'),
 cert      = fs.readFileSync('tptblockchain.crt' ),
 options   = {key: key, cert: cert};

const app  = express()
 server    = https.createServer(options, app),
 conn      = mysql.createConnection({host: config.mySqlHost , user: config.mySqlUser, password: config.mySqlPass, database: config.mySqlUser});

const openchainValCli = new openchain.ApiClient(config.openchainValidator);

const database = new bd.Database();

const clientStatus = {	
    EnAttente: 1,
    EnCours: 2,
    Valide: 3,
    PasValide: 4,
    Bloque: 5
}

const statusClient = ['Innconu', 'En Attente', 'En Cours', 'Validé', 'Pas Validé', 'Bloqué'];

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 250 // limit each IP to 250 requests per windowMs
  });

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: config.HTGMail,
        clientId: config.HTGClientId,
        clientSecret: config.HTGClientSecret,
        refreshToken: config.HTGRefreshToken,
        accessToken: 'ya29.Gls8BxPOJF1s2P7_IzFNwq6n78bB6fLGHRcmojLzNo38tLL47Q_UJixa28RhG4s2l_OSnn5gUvqnWb3-gtasQtL64Wo8OmVpNHikyZqxlpZyx2yeyWoTsKiQCOro',
        expires: 3500
    },
    tls: {
        rejectUnauthorized: false
    }
});

const HeplerOptions = {};

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(helmet());
app.use(limiter);
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Authorization, Content-Type, X-Requested-With, Range, X-Content-Type-Options');
    console.log("[REQUEST] " + req.url + " : " + util.inspect(req.body, {showHidden: false, depth: null}));
    next();
});

server.listen(config.port);
console.log("Serveur lancé sur le port : " + config.port);

openchainValCli.initialize().then( function(res) {
    console.log("Openchain initialized: " + openchainValCli.namespace.toHex());
});

app.get('/bienvenue', function(req, res) {
    res.send('<h1>Votre Certificat SSL vient d\'etre ajouté!<h1><a href="http://82.255.166.104/TPTBlockchain/portail">Revenir</a><br><a href="http://localhost:4200/portail">Revenir Local</a>');
});

app.get('/allMonnies', [
    check('type').isString().isIn(["electronique", "physique"]),
    outils.handleValidationResult,
    ], function(req, res) {
    
    database.queryWithCatch(sql.getAllMonnies, [req.query.type], res, "Error", 500)
        .then(result => { if(result) { return res.send(result)}; }); //queryWithCatch handles the error
});

app.get('/allBanks', [
    check('visible').optional().isString().isIn(["true", "false"]),
    outils.handleValidationResult,
    ], function(req, res) {

    let aQuerry = sql.getAllBanks;
    if(req.query.visible === 'true') aQuerry = sql.getAllBanks_Visible;
    if(req.query.visible === 'false') aQuerry = sql.getAllBanks_NotVisible;
    database.queryWithCatch(aQuerry, [], res, "Error", 500)
        .then(result => { if(result) { return res.send(result); }});
    });

app.get('/allBanksUtilisateurs', function(req, res) {
    let aQuerry = sql.findUtilisateursByBanque;
    conn.query(aQuerry, function(err, result){
        res.send((err) ? "Error" : result);
    });
});

app.get('/allParametres', function(req, res) {
    let aQuerry = sql.getAllPrametres;
    conn.query(aQuerry, function(err, result){
        res.send((err) ? "Error" : result);
    });
});


app.get('/allBanksValid', function(req, res) {
    conn.query(sql.getAllBanks_Valid,["valide","brh"], function(err, result){
        res.send((err) ? "Error" : result);
    });
});

app.get('/allBanksNotValid', function(req, res) {
    conn.query(sql.getAllBanks_NotValid,["valide"], function(err, result){
        res.send((err) ? "Error" : result);
    });
});

app.get('/clients', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.BANQUE),
    check('banque').isAlphanumeric().escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {
    
    if(req.jwt.Banque !== req.query.banque && req.jwt.PermissionLevel !== config.permissionLevels.ADMIN)
        return res.status(403).send();
    database.queryWithCatch(sql.findClientsByBanque, [req.query.banque], res, "Error", true).then(result => {
        if(!result) return;
        outils.fixPortefeuilles(result);
        res.send(result);
    });
});

app.get('/allClients', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN)], 
    function(req, res) {

    conn.query(sql.getAllClients, function(err, result){
        outils.fixPortefeuilles(result);
        res.send((err) ? "Error" : result);
    });
});


app.get('/allClientsBanque', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN)], 
    function(req, res) {

  //  conn.query(sql.getAllClients, function(err, result){
    conn.query(sql.getAllClientsBanques, function(err, result){
        outils.fixPortefeuilles(result);
        res.send((err) ? "Error" : result);
    });
});

app.get('/clientDocuments', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.BANQUE),
    check('email').isEmail().escape().trim(),
    outils.handleValidationResult],
    function(req, res) {

    conn.query(sql.findUtilisateurByEmail, [req.query.email], function(err, result){
        if(err || !result[0]) return res.status(404).send({ succes: false, errors: ["user not found!"] });
        if(req.jwt.PermissionLevel == config.permissionLevels.BANQUE && req.jwt.Banque != result[0].Banque)
            return res.status(405).send({ succes: false, errors: ["You don't own that user!"] });
    
        conn.query(sql.getClientDocsByEmail, req.query.email, function(err, result){
            res.send((err) ? "Error" : result);
        });
    });
});

app.post('/cardsByPortefeuilleIds', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('Ids').isArray().isLength({ min: 1 }),
    outils.handleValidationResult],
    function(req, res) {
        
    conn.query(sql.findCartesByPortefeuilleIds, [req.body.Ids], function(err, result){
        if(err) return res.status(400).send({errors: ['Could not fetch cards']});
        res.send((err) ? "Error" : result);
    });
})

// Not optimal, but can't get transaction memo from openchain...
app.post('/motifsByMutationHashes', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('MutationHashes').isArray().isLength({ min: 0 }),
    outils.handleValidationResult],
    function(req, res) {
    conn.query(sql.findMotifsByMutationHashes, [req.body.MutationHashes], function(err, result){
        if(err) return res.status(400).send({errors: ['Could not fetch motifs']});
        res.send((err) ? "Error" : result);
    });
})


app.post('/portefeuillesByBanqueEmail', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN),
    check('email').isEmail().escape().trim(),
    outils.handleValidationResult],
    function(req, res) {
  
    conn.query(sql.findPortefeuillesByBanqueEmail, req.body.email, function(err, result){
        if(err) return res.status(400).send({errors: ['Could not fetch wallets']});
        res.send((err) ? "Error" : result);
    });
})
app.post('/portefeuillesByUserEmail', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    outils.handleValidationResult],
    function(req, res) {
        
    conn.query(sql.findPortefeuillesByEmail, req.jwt.Email, function(err, result){
        if(err) return res.status(400).send({errors: ['Could not fetch wallets']});
        res.send((err) ? "Error" : result);
    });
})

app.get('/contactsByUserEmail', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    outils.handleValidationResult],
    function(req, res) {
        
    conn.query(sql.findContactsByEmail, req.jwt.Email, function(err, result) {
        if(err || !result[0]) return res.status(400).send({errors: ['Could not fetch contacts']});
        res.send((err) ? "Error" : result);
    });
})

app.post('/createBank', [
//    outils.validJWTNeeded, 
  //  outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN),
    check('pieceIdentite').isLength({ min: 1 }).escape(),
    check('annonceLegale').isLength({ min: 1 }).escape(),
    check('justificatifDomicile').isLength({ min: 1 }).escape(),
    check('name').isAlphanumeric().escape().trim(),
    check('email').isEmail().escape().trim(),
    check('telephone').isMobilePhone().escape().trim(),
    check('isVisible').isLength({ min: 1 }).isNumeric().isIn([0,1]),
    outils.handleValidationResult],
    function(req, res) {

    conn.query(sql.insertBanque_0_3, [req.body.name,req.body.email,req.body.telephone,req.body.isVisible], function(err, result) { 
        return res.send({success: !err});
    });
});

app.post('/createMonnie', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN),
    check('name').isLength({ min: 1 }).matches(/^[a-z0-9 ]+$/i).escape().trim(),
    //check('name').isAlphanumeric().escape().trim(),
    check('unite').isLength({ min: 1 }).isNumeric().trim(),
    outils.handleValidationResult],
    function(req, res) {
    
    conn.query(sql.insertMonnie, [req.body.name,req.body.unite,req.body.type], function(err, result) { 
        return res.send({success: !err});
    });
});

app.post('/createParametre', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN),
    check('name').isLength({ min: 1 }).matches(/^[a-z0-9 ]+$/i).escape().trim(),
    check('description').optional().matches(/^[a-z0-9 ]+$/i).escape(),
    check('valeur').optional().matches(/^[a-z0-9 ]+$/i).escape(),
    outils.handleValidationResult],
    function(req, res) {
    conn.query(sql.insertParametre, [req.body.name,req.body.description,req.body.valeur], function(err, result) { 
        return res.send({success: !err});
    });
});

app.post('/createClient', [
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 5 }).escape(),
    check('prenom').isLength({ min: 3 }).escape().trim(),
    check('nom').isLength({ min: 3 }).escape().trim(),
    check('tel').optional().isMobilePhone(),
    check('banque').isLength({ min: 3 }).isAlphanumeric().escape().trim(),
    check('roleId').isLength({ min: 1 }).isNumeric().isIn([1,2,3]),
    outils.handleValidationResult], 
    function(req, res) {

    keys = outils.generateEncryptedKeys(req.body.password);
    req.body.password = outils.hashPassword(req.body.password);
    if (!req.body.tel) req.body.tel = "";
    conn.beginTransaction(function(iTransactionError) {
        if (iTransactionError) { return res.status(500).send({success: !err, errors: ["Server Error"]});}
        conn.query(sql.insertUtilisateur, [req.body.email, req.body.password, req.body.nom, req.body.prenom, req.body.tel, req.body.banque, req.body.roleId], function(err, result) {
            if(err) {
                conn.rollback(function() {
                    return res.send({success: !err, error: "Probleme de creation de Utilisateur!"});
                });
                return;
            }
            let currDate = new Date();
            let dateStr = currDate.getFullYear()+"-"+(currDate.getMonth()+1)+"-"+currDate.getDate();
            let randomToken = cryptoRandom({length: 300, type: 'url-safe'});
            conn.query(sql.insertPortefeuille, ['Portefeuille Principal', keys.address, keys.privateKey, req.body.email, dateStr], function(err2, result2){
                if(err2) {
                    conn.rollback(function() {
                        return res.send({success: false, error: "Probleme de creation de Portefeuilles!"});
                    });
                    return;
                }
                conn.query(sql.insertRandomToken, [req.body.email, randomToken], function(err3, result3){
                    if(err3) {
                        conn.rollback(function() {
                            return res.status(500).send({success: false, errors: ["Probleme de creation du token pour le client"]});
                        });
                        return;
                    }
                    createConfimationEmailText(req, randomToken);
                    transporter.sendMail(HeplerOptions, (error, info) => {
                        if(error) {
                            conn.rollback(function() {
                                console.log("Error while sending Email!");
                                console.log(error);
                                console.log(info);
                                return res.status(500).send({success: false, errors: ["Probleme d'envoi d'email"]});
                            });
                            return;
                        }
                        conn.commit(function(iCommitError) {
                            if (iCommitError) {
                                return res.status(500).send({success: false, errors: ["Probleme de commit de la transaction"]});
                            }
                            return res.send({success: true});
                        })
                    });
                });
            });
        });
    });
});

function createConfimationEmailText(req, token) {
    HeplerOptions.from = '"Projet TPT Blockchain" HTG666663@gmail.com';
    HeplerOptions.to = req.body.email;
    HeplerOptions.subject = 'Confirmation de création de compte';
    HeplerOptions.html = '<h2>Bienvenue ' + req.body.prenom + ' ' + req.body.nom + '</h2>' + 
    '<p> Nous vous remercions de votre confiance dans notre platforme Digital HaïTian Gourde </p>' + 
    '<p> Votre demande de creation du compte chez ' + req.body.banque + 
    ' a bien été pris en compte et est en attente de confirmation de votre adresse Email !</p>' + 
    '<p> Pour passer à l\'étape suivate de votre inscription, cliquez sur ' + 
    '<a href="http://82.255.166.104/TPTBlockchain/validationEmail?token=' + token + '">ce lien</a>' +
    ' et suivez les instructions sur le site pour valider votre demande </p><br><br>' + 
    'Cordialement, <br> votre equipe TPTBlockchain';
}

app.post('/sendDocumentsValidatedEmailToClient', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.BANQUE),
    check('email').isEmail().normalizeEmail(),
    check('prenom').isLength({ min: 3 }).escape().trim(),
    check('nom').isLength({ min: 3 }).escape().trim(),
    check('banque').isLength({ min: 5 }).isAlphanumeric().escape().trim(),
    check('isValidated').isBoolean(),
    check('explicationRefus').optional().matches(/^[a-z0-9 ]+$/i).escape(),
    outils.handleValidationResult], 
    function(req, res) {

    HeplerOptions.from = '"Projet TPT Blockchain" HTG666663@gmail.com';
    HeplerOptions.to = req.body.email;
    HeplerOptions.subject = 'Validation de vos documents';
    let explicationRefus = req.body.explicationRefus ? req.body.explicationRefus : '';
    if (req.body.isValidated) {
        HeplerOptions.html = '<h2>Bienvenue ' + req.body.prenom + ' ' + req.body.nom + '</h2>' + 
        '<p> Nous vous remercions de votre confiance dans notre platforme Digital HaïTian Gourde </p>' + 
        '<p> Nous avons le plaisir de vous annocer que votre demande de creation du compte chez ' + req.body.banque + 
        ' vient d\'etre accepte!</p>' + 
        '<p> Vous pouvez des a present vous connecter a ' + 
        '<a href="http://82.255.166.104/TPTBlockchain/">votre espace personelle</a>.' +
        '</p><br><br>' + 
        'Cordialement, <br> votre equipe TPTBlockchain';
    } else {
        HeplerOptions.subject = 'Refus de vos documets';
        HeplerOptions.html = '<h2>Bienvenue ' + req.body.prenom + ' ' + req.body.nom + '</h2>' + 
        '<p> Nous vous remercions de votre confiance dans notre platforme Digital HaïTian Gourde </p>' + 
        '<p> Malheureusement nous ne pouvons pas faire suite a votre demande de creation de votre compte chez ' + req.body.banque + 
        ' puisque un ou plusiers documents fournis par vous etaient rejetes.</p>' + 
        '<p> Nous vous invitons a vous reconnecter a ' +
        '<a href="http://82.255.166.104/TPTBlockchain/">votre espace personelle</a>.' +
        ' et nous fournir les documents neccessaires en bon format.</p><p> Raison detaille du rejet: ' + 
        explicationRefus + '</p><br><br>' + 
        'Cordialement, <br> votre equipe TPTBlockchain';
    }

    transporter.sendMail(HeplerOptions, (error, info) => {
        if(error) return res.status(500).send({success: false, errors: ["Probleme d'envoi d'email"]});
        return res.send({success: true});
    });
});

app.post('/createPortefeuille', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('password').isLength({ min: 5 }).escape(),
    check('libelle').isLength({ min: 1 }).matches(/^[a-zA-Z0-9 éèàô]+$/i).escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {
    
    conn.query(sql.findUtilisateurByEmail, [req.jwt.Email], function(err, result){
        if(err || !result[0]) return res.status(404).send({ succes: false, errors: ["user not found!"] });
        result = result[0];
        let passwordFields = result.Password.split('$');
        let salt = passwordFields[0];
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        if (hash !== passwordFields[1]) return res.status(400).send({errors: ['Invalid password']});
        keys = outils.generateEncryptedKeys(req.body.password);
        if(err) return res.send({success: !err});
        let currDate = new Date();
        let dateStr = currDate.getFullYear()+"-"+(currDate.getMonth()+1)+"-"+currDate.getDate();
        conn.query(sql.insertPortefeuille, [req.body.libelle, keys.address, keys.privateKey, req.jwt.Email, dateStr], function(err2, result2){
            return res.send({success: !err2});
    });
    });
});

app.post('/createCarte', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('portefeuille_id').isNumeric().escape(),
    // Regex to allow spaces between alphanumeric characters
    check('libelle').isLength({ min: 1 }).matches(/^[a-zA-Z0-9 éèàô]+$/i).escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {

    let currDate = new Date();
    let dateStr = currDate.getFullYear()+"-"+(currDate.getMonth()+1)+"-"+currDate.getDate();
    conn.query(sql.insertCarte, [req.body.libelle, req.body.portefeuille_id, dateStr], function(err, result){
        if(err) return res.status(400).send({ succes: false, errors: ["Could not insert carte for portefeuille id: " + req.body.portefeuille_id] });
        return res.send({success: !err});
    });
});

app.put('/blockClient', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.BANQUE),
    check('email').isEmail().normalizeEmail(),
    outils.handleValidationResult], 
    function(req, res) {

    conn.query(sql.findUtilisateurByEmail, [req.body.email], function(err, result){
        if(err || !result[0]) return res.status(404).send({ succes: false, errors: ["user not found!"] });
        if(req.jwt.PermissionLevel == config.permissionLevels.BANQUE && req.jwt.Banque != result[0].Banque)
            return res.status(405).send({ succes: false, errors: ["You don't own that user!"] });

        conn.query(sql.blockClient_0_1, [req.body.email], function(err, result) {
            return res.send({ succes: !err && result.affectedRows != 0});
        });
    });
});

app.put('/blockCarte', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('id').isNumeric().escape(),
    outils.handleValidationResult], 
    function(req, res) {

    database.queryWithCatch(sql.findEmailFromCartId, [req.body.id], res, "Bad ID", 404).then(resEmail => {
        if(!resEmail) return;
        resEmail = resEmail[0].Utilisateur_Email;
        if(req.jwt.PermissionLevel >= config.permissionLevels.BANQUE) {
            database.queryWithCatch(sql.findUtilisateurByEmail, [resEmail], res).then( resUtilisateur => {
                if(req.jwt.PermissionLevel == config.permissionLevels.BANQUE && req.jwt.Banque != resUtilisateur[0].Banque)
                    return res.status(405).send({ succes: false, errors: ["You don't own that user!"] });
                database.queryWithCatch(sql.blockCarte, [req.body.id], res).then( resFinal => {
                    if(resFinal) { res.send({ succes: true })}
                });
            });
        } else if(resEmail === req.jwt.Email) {
            database.queryWithCatch(sql.blockCarte, [req.body.id], res).then( resFinal => {
                if(resFinal) { res.send({ succes: true })}
            });
        } else {
            return res.status(403).send({succes: false});;
        }
    });
});

app.put('/unblockCarte', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('id').isNumeric().escape(),
    outils.handleValidationResult], 
    function(req, res) {

    database.queryWithCatch(sql.findEmailFromCartId, [req.body.id], res, "Bad ID", 404).then(resEmail => {
        if(!resEmail) return;
        resEmail = resEmail[0].Utilisateur_Email;
        if(req.jwt.PermissionLevel >= config.permissionLevels.BANQUE) {
            database.queryWithCatch(sql.findUtilisateurByEmail, [resEmail], res).then( resUtilisateur => {
                if(req.jwt.PermissionLevel == config.permissionLevels.BANQUE && req.jwt.Banque != resUtilisateur[0].Banque)
                    return res.status(405).send({ succes: false, errors: ["You don't own that user!"] });
                database.queryWithCatch(sql.unblockCarte, [req.body.id], res).then( resFinal => {
                    if(resFinal) { res.send({ succes: true })}
                });
            });
        } else if(resEmail === req.jwt.Email) {
            database.queryWithCatch(sql.unblockCarte, [req.body.id], res).then( resFinal => {
                if(resFinal) { res.send({ succes: true })}
            });
        } else {
            return res.status(403).send({succes: false});;
        }
    });
});

app.put('/updateParametre', [
    outils.validJWTNeeded, 
    check('parametreId').isNumeric().escape(),
    check('parametreNom').isLength({ min: 1 }).matches(/^[a-z0-9 ]+$/i).escape().trim(),
    outils.minimumPermissionLevelRequired(config.permissionLevels.BANQUE),
    outils.handleValidationResult], 
    function(req, res) {
        console.log('permission level : ' + req.jwt.PermissionLevel);
 
        if(req.jwt.PermissionLevel >= 3)
        conn.query(sql.updateParametre, [req.body.parametreNom, req.body.parametreDescription,req.body.parametreValeur, req.body.parametreId], function(err1, result1){
            return res.send({ succes: !err1 && result1.affectedRows != 0});
        });
    });

app.put('/updateBanque', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.BANQUE),
    check('banqueNew').isLength({ min: 1 }).isAlphanumeric().escape().trim(),
    check('banqueOld').optional().isLength({ min: 1 }).isAlphanumeric().escape().trim(),
    check('email').isEmail().normalizeEmail(),
    check('telephone').optional().isMobilePhone().escape().trim(),
    check('isVisible').optional().isNumeric().escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {
    let aBanqueOld = req.jwt.Banque;
    console.log('permission level : ' + req.jwt.PermissionLevel);
    if(req.jwt.PermissionLevel >= 3 && req.body.banqueOld != undefined)
        aBanqueOld = req.body.banqueOld;
    console.log('banque old = ' + aBanqueOld);
    conn.query(sql.findBanqueByName, [aBanqueOld], function(err, result){
        if(err || !result[0]) return res.status(404).send({ succes: false, errors: ["banque not found!"] });
        const aEmail = outils.hasChanged(req.body.email, result[0].Email);
        const aTel = outils.hasChanged(req.body.telephone, result[0].Tel);
        const aIsVisible = outils.hasChanged(req.body.isVisible, result[0].isVisible);
        const aStatut = outils.hasChanged(req.body.statut, result[0].statut);
        const aVirement = outils.hasChanged(req.body.virement, result[0].statut);

        conn.query(sql.updateBank_0_2, [req.body.banqueNew, aEmail, aTel,aIsVisible, aStatut,aVirement, aBanqueOld], function(err1, result1){

            return res.send({ succes: !err1 && result1.affectedRows != 0});
        });
    });
});

app.put('/updateMonnie', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.BANQUE),
      check('monnieNew').isLength({ min: 1 }).matches(/^[a-z0-9 ]+$/i).escape().trim(),
      check('monnieUnite').isNumeric({ min: 1 }).escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {
        console.log('permission level : ' + req.jwt.PermissionLevel);
    if(req.jwt.PermissionLevel >= 3)
        conn.query(sql.updateMonnie, [req.body.monnieNew, req.body.monnieUnite, req.body.monnieId], function(err1, result1){
            return res.send({ succes: !err1 && result1.affectedRows != 0});
        });
    });

app.put('/updateCarte', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('id').isNumeric().escape(),
    // Regex to allow spaces between alphanumeric characters
    check('libelle').isLength({ min: 1 }).matches(/^[[a-zA-Z0-9 éèàô]+$/i).escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {
    
    conn.query(sql.updateCarte, [req.body.libelle, req.body.id], function(err, result){
        if(err) return res.status(400).send({ succes: false, errors: ["Could not update carte with id: " + req.body.id] });
        return res.send({success: !err});
    });
});

app.put('/updatePortefeuilleLibelle', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('id').isNumeric().escape(),
    // Regex to allow spaces between alphanumeric characters
    check('libelle').isLength({ min: 1 }).matches(/^[a-zA-Z0-9 éèàô]+$/i).escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {
    
    conn.query(sql.updatePortefeuilleLibelle, [req.body.libelle, req.body.id], function(err, result){
        if(err) return res.status(400).send({ succes: false, errors: ["Could not update wallet with id: " + req.body.id] });
        return res.send({success: !err});
    });
});

app.put('/updateContact', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('id').isNumeric().escape(),
    // Regex to allow spaces between alphanumeric characters
    check('libelle').isLength({ min: 1 }).matches(/^[a-zA-Z0-9 éèàô]+$/i).escape().trim(),
    check('clePub').isLength({ min: 1 }).escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {
    
    conn.query(sql.updateContact, [req.body.libelle, req.body.clePub, req.body.id], function(err, result){
        if(err) return res.status(400).send({ succes: false, errors: ["Could not update contact with id: " + req.body.id] });
        return res.send({success: !err});
    });
});

app.put('/updateClient', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.PUBLIC),
    check('email').optional().isEmail().normalizeEmail(),
    check('bankEmail').optional().isEmail().normalizeEmail(),
    check('nom').optional().isString().escape(),
    check('prenom').optional().isString().escape(),
    check('civilite').optional().isAlpha().escape().trim(),
    check('situationFamiliale').optional().isAlpha().escape().trim(),
    check('profession').optional().isAlpha().escape().trim(),
    check('siret').optional().isAlphanumeric().escape().trim(),
    check('tel').optional().isMobilePhone().escape(),
    check('adresse').optional().isString().escape(),
    check('ville').optional().isString().escape(),
    check('codePostal').optional().isNumeric({ min: 1 }).escape(),
    check('oldPassword').optional().isLength({ min: 5 }).escape(),
    check('newPassword').optional().isLength({ min: 5 }).escape(),
    outils.handleValidationResult], 
    function(req, res) {

    let aOldEmail = req.jwt.Email;
    if(req.jwt.PermissionLevel >= 2 && req.body.bankEmail != undefined)
        aOldEmail = req.body.bankEmail;
    conn.query(sql.findUtilisateurByEmail, [aOldEmail], function(err, result){
        if(err || !result[0]) return res.status(404).send({ succes: false, errors: ["user not found!"] });
        if(req.jwt.PermissionLevel == config.permissionLevels.BANQUE && req.jwt.Banque != result[0].Banque)
            return res.status(405).send({ succes: false, errors: ["You don't own that user!"] });
        const aEmail = (req.body.email === undefined) ? aOldEmail : req.body.email;
        const aNom = outils.hasChanged(req.body.nom, result[0].Nom);
        const aPrenom = outils.hasChanged(req.body.prenom, result[0].Prenom);
        const aCivilite = outils.hasChanged(req.body.civilite, result[0].Civilite);
        const asituationFamiliale = outils.hasChanged(req.body.situationFamiliale, result[0].Situation_Familiale);
        const aprofession = outils.hasChanged(req.body.profession, result[0].Profession);
        const asiret = outils.hasChanged(req.body.siret, result[0].Siret);
        const atel = outils.hasChanged(req.body.tel, result[0].Tel);
        const aadresse = outils.hasChanged(req.body.adresse, result[0].Adresse);
        const aville = outils.hasChanged(req.body.ville, result[0].Ville);
        const acodePostal = outils.hasChanged(req.body.codePostal, result[0].Code_postal);
        const skipPassword = req.body.oldPassword === undefined || req.body.newPassword === undefined;
        let aPassword = (skipPassword) ? result[0].Password : outils.hashPassword(req.body.newPassword);
        if(!skipPassword){
            conn.query(sql.findPortefeuillesByEmail, [aOldEmail], function(err1, result1){
                if(err1 || !result1[0]) return res.status(404).send({ succes: false, errors: ["Ups, il semble vous n\'avez pas de portefeuille..."] });
                for (let i = 0; i < result1.length; i++) {
                    let aportefeuille = result1[i];
                    console.log('portefeuille: ');
                    console.log(aportefeuille);
                    let aWallet; 
                    let decryptedHDK;
                    try {
                        decryptedHDK = outils.decryptAES(aportefeuille.ClePrive, outils.getKeyFromPassword(req.body.oldPassword));
                        aWallet = outils.encryptAES(decryptedHDK, outils.getKeyFromPassword(req.body.newPassword)) 
                        conn.query(sql.updatePortefeuille, [aportefeuille.Libelle, aportefeuille.ClePub, aWallet, aOldEmail], function(err2, result2){
                            if(err2) res.status(500).send({ succes: false, errors: ["some thing bad happend while updating your wallets!"] });
                        });
                    } catch(error) {
                        console.log("[ERROR]: " + error);
                        return res.status(400).send({ succes: false, errors: ["wrong password!"] });
                    }
                }
            });
        }
        conn.query(sql.updateClient, [aEmail, aPassword, aNom, aPrenom, aCivilite,asituationFamiliale, aprofession, asiret, atel, aadresse, aville, acodePostal, aOldEmail], function(err, result){
            console.log("icicicicicicicici");

            console.log(err);
            console.log(result);
            return res.send({ succes: !err && result.affectedRows != 0});
        });
    });
});

app.put('/unBlockClient', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.BANQUE),
    check('email').isEmail().normalizeEmail(),
    outils.handleValidationResult], 
    function(req, res) {

    conn.query(sql.findUtilisateurByEmail, [req.body.email], function(err, result){
        if(err || !result[0]) return res.status(404).send({ succes: false, errors: ["user not found!"] });
        if(req.jwt.PermissionLevel == config.permissionLevels.BANQUE && req.jwt.Banque != result[0].Banque)
            return res.status(405).send({ succes: false, errors: ["You don't own that user!"] });

        conn.query(sql.unBlockClient_0_1, [req.body.email], function(err, result){
            console.log(err);
            console.log(result);
            return res.send({ succes: !err && result.affectedRows != 0});
        });
    });
});

app.put('/unBlockBanque', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.BANQUE),
    check('email').isEmail().normalizeEmail(),
    outils.handleValidationResult], 
    function(req, res) {

    conn.query(sql.findUtilisateurByEmail, [req.body.email], function(err, result){
        if(err || !result[0]) return res.status(404).send({ succes: false, errors: ["user not found!"] });
        if(req.jwt.PermissionLevel == config.permissionLevels.BANQUE && req.jwt.Banque != result[0].Banque)
            return res.status(405).send({ succes: false, errors: ["You don't own that user!"] });

        conn.query(sql.unBlockBanque, [req.body.email], function(err, result){
            console.log(err);
            console.log(result);
            return res.send({ succes: !err && result.affectedRows != 0});
        });
    });
});


app.put('/unBlockOrBlockClient', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.BANQUE),
    check('bankEmail').isEmail().normalizeEmail(),
    check('status').isIn(['Public', 'DemandeParticulier', 'DemandeCommercant', 'Particulier', 'Commercant']),
    check('clientStatus').optional().isIn(statusClient),
    outils.handleValidationResult], 
    function(req, res) {

    conn.query(sql.findUtilisateurByEmail, [req.body.bankEmail], function(err, result){
        if(err || !result[0]) return res.status(404).send({ succes: false, errors: ["user not found!"] });
        if(req.jwt.PermissionLevel == config.permissionLevels.BANQUE && req.jwt.Banque != result[0].Banque)
            return res.status(405).send({ succes: false, errors: ["You don't own that user!"] });
        
        const roles = ['Public', 'DemandeParticulier', 'DemandeCommercant', 'DemandeBanque', 'Particulier', 'Commercant'];
        let roleId = roles.indexOf(req.body.status);
        
        let aClientStatus = req.body.clientStatus ? statusClient.indexOf(req.body.clientStatus) : 
            roles[roleId].substr(0, 7) === 'Demande' ? clientStatus.Bloque : clientStatus.Valide;
        if (aClientStatus === clientStatus.Valide){
            database.queryWithCatch(sql.deleteLoginAttempts, [req.body.bankEmail], res, '', 400, false);
        }
        database.queryWithCatch(sql.unBlockOrBlockClient_0_2, [roleId, aClientStatus, req.body.bankEmail], res).then( result => {
            if(result) return res.send({succes: true});
        });
    });
});

app.put('/changeStatusClient', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.BANQUE),
    check('bankEmail').isEmail().normalizeEmail(),
    check('status').isIn(statusClient),
    outils.handleValidationResult], 
    function(req, res) {

    conn.query(sql.findUtilisateurByEmail, [req.body.bankEmail], function(err, result){
        if(err || !result[0]) return res.status(404).send({ succes: false, errors: ["user not found!"] });
        if(req.jwt.PermissionLevel == config.permissionLevels.BANQUE && req.jwt.Banque != result[0].Banque)
            return res.status(405).send({ succes: false, errors: ["You don't own that user!"] });
        
        if (req.body.status === statusClient[clientStatus.Valide]){
            database.queryWithCatch(sql.deleteLoginAttempts, [req.body.bankEmail], res, '', 400, false);
        }
        let aStatus = statusClient.indexOf(req.body.status);
        database.queryWithCatch(sql.unBlockOrBlockClient_0, [aStatus, req.body.bankEmail], res).then( result => {
            if(result) return res.send({succes: true});
        });
    });
});

app.post('/createBankClient', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN),
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 5 }).escape(),
    check('banque').isLength({ min: 5 }).isAlphanumeric().escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {

    keys = outils.generateEncryptedKeys(req.body.password);
    req.body.password = outils.hashPassword(req.body.password);
    conn.query(sql.insertUtilisateurBanque, [req.body.email, req.body.password, req.body.banque], function(err, result) {
        if(err) return res.send({success: !err});
        conn.query(sql.insertPortefeuille, ['Portefeuille Principal', keys.address, keys.privateKey, req.body.email], function(err2, result2){
            return res.send({success: !err});
        });
    });
});

app.post('/createContact', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('libelle').isLength({ min: 1 }).escape(),
    check('clePub').isLength({ min: 1 }).escape(),
    outils.handleValidationResult], 
    function(req, res) {

    let currDate = new Date();
    let dateStr = currDate.getFullYear()+"-"+(currDate.getMonth()+1)+"-"+currDate.getDate();
    conn.query(sql.insertContact_0_4, [req.jwt.Email, req.body.libelle, req.body.clePub, dateStr], function(err, result){
        return res.send({ succes: !err});
    });
});

app.post('/createContactByUserEmail', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.PUBLIC),
    check('libelle').isLength({ min: 1 }).escape(),
    check('email').isEmail().escape(),
    outils.handleValidationResult], 
    function(req, res) {

    conn.query(sql.findPortefeuillesByEmail, [req.body.email], function(err1, result1){
        if(err1 || !result1[0]) return res.status(400).send({errors: ['Aucun portefeuille correspond à cet adresse mail...']});
        let clePub = result1[0].ClePub;
        let currDate = new Date();
        let dateStr = currDate.getFullYear()+"-"+(currDate.getMonth()+1)+"-"+currDate.getDate();
        conn.query(sql.insertContact_0_4, [req.jwt.Email, req.body.libelle, clePub, dateStr], function(err2, result2){
            return res.send({ succes: !err2});
        });
    });
});

app.post('/insertTransactionMotif', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('MutationHash').isLength({ min: 1 }).escape(),
    check('Motif').isLength({ min: 3 }).matches(/^[a-zA-Z0-9 éèàô]+$/i).escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {
    
    conn.query(sql.insertTransactionMotif, [req.body.MutationHash, req.body.Motif], function(err, result){
        if(err) return res.status(400).send({errors: ['Could not insert motif']});
            return res.send({success: !err});
    });
});

app.post('/insertCommercantDocs', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.PUBLIC),
    check('tel').isNumeric().isLength({ min: 1 }).escape(),
    check('addresse').isLength({ min: 1 }).escape(),
    check('ville').isLength({ min: 1 }).escape(),
    check('codePostal').isNumeric().isLength({ min: 1 }).escape(),
    check('annonceLegale').isLength({ min: 1 }).escape(),
    check('statutJuridique').isLength({ min: 1 }).escape(),
    check('siret').isNumeric().isLength({ min: 1 }).escape(),
    check('secteurActivite').isLength({ min: 1 }).escape(),
    outils.handleValidationResult], 
    function(req, res) {
    
    conn.query(sql.insertCommercantDocs, [req.jwt.Email, req.body.annonceLegale], function(err, result){
        if(err) return res.status(400).send({errors: ['Could not upload documents']});
        conn.query(sql.updateCommercantInfo, [req.body.statutJuridique, req.body.siret, req.body.secteurActivite, req.body.tel, req.body.addresse, req.body.ville, req.body.codePostal, 2, req.jwt.Email], function(err2, result2){
            return res.send({success: !err});
        });
    });
});

app.post('/updateCommercantDocs', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.PUBLIC),
    check('tel').isNumeric().isLength({ min: 1 }).escape(),
    check('addresse').isLength({ min: 1 }).escape(),
    check('ville').isLength({ min: 1 }).escape(),
    check('codePostal').isNumeric().isLength({ min: 1 }).escape(),
    check('annonceLegale').isLength({ min: 1 }).escape(),
    check('statutJuridique').isLength({ min: 1 }).escape(),
    check('siret').isNumeric().isLength({ min: 1 }).escape(),
    check('secteurActivite').isLength({ min: 1 }).escape(),
    outils.handleValidationResult], 
    function(req, res) {
    
    conn.query(sql.updateCommercantDocs, [req.body.annonceLegale, req.jwt.Email], function(err, result){
        if(err) return res.status(400).send({errors: ['Could not upload documents']});
        conn.query(sql.updateCommercantInfo, [req.body.statutJuridique, req.body.siret, req.body.secteurActivite, req.body.tel, req.body.addresse, req.body.ville, req.body.codePostal, 2, req.jwt.Email], function(err2, result2){
            return res.send({success: !err});
        });
    });
});

app.post('/insertParticulierDocs', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.PUBLIC),
    check('tel').isNumeric().isLength({ min: 1 }).escape(),
    check('addresse').isLength({ min: 1 }).escape(),
    check('ville').isLength({ min: 1 }).escape(),
    check('codePostal').isNumeric().isLength({ min: 1 }).escape(),
    check('pieceIdentite').isLength({ min: 1 }).escape(),
    check('justificatifDomicile').isLength({ min: 1 }).escape(),
    check('civilite').isLength({ min: 1 }).escape(),
    check('situation').isLength({ min: 1 }).escape(),
    check('profession').isLength({ min: 1 }).escape(),
    outils.handleValidationResult], 
    function(req, res) {

    conn.query(sql.insertParticulierDocs, [req.jwt.Email, req.body.pieceIdentite, req.body.justificatifDomicile], function(err, result){
        if(err) return res.status(400).send({errors: ['Could not upload documents']});
        conn.query(sql.updateParticulierInfo, [req.body.civilite, req.body.situation, req.body.profession, req.body.tel, req.body.addresse, req.body.ville, req.body.codePostal, 2, req.jwt.Email], function(err2, result2){
            return res.send({success: !err});
        });
    });
});

app.post('/insertBanqueDocs', [
  
    check('email').isEmail().normalizeEmail(),
    check('pieceIdentite').isLength({ min: 1 }).escape(),
    check('justificatifDomicile').isLength({ min: 1 }).escape(),
    check('annonceLegale').isLength({ min: 1 }).escape(),
    outils.handleValidationResult],  
    function(req, res) {
    conn.query(sql.insertBanqueDocs, [req.body.email, req.body.pieceIdentite, req.body.justificatifDomicile,req.body.annonceLegale], function(err, result){
        return res.send({success: !err});
    });
});


app.post('/updateParticulierDocs', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.PUBLIC),
    check('tel').isNumeric().isLength({ min: 1 }).escape(),
    check('addresse').isLength({ min: 1 }).escape(),
    check('ville').isLength({ min: 1 }).escape(),
    check('codePostal').isNumeric().isLength({ min: 1 }).escape(),
    check('pieceIdentite').isLength({ min: 1 }).escape(),
    check('justificatifDomicile').isLength({ min: 1 }).escape(),
    check('civilite').isLength({ min: 1 }).escape(),
    check('situation').isLength({ min: 1 }).escape(),
    check('profession').isLength({ min: 1 }).escape(),
    outils.handleValidationResult], 
    function(req, res) {
    
    conn.query(sql.updateParticulierDocs, [req.body.pieceIdentite, req.body.justificatifDomicile, req.jwt.Email], function(err, result){
        if(err) return res.status(400).send({errors: ['Could not upload documents']});
        conn.query(sql.updateParticulierInfo, [req.body.civilite, req.body.situation, req.body.profession, req.body.tel, req.body.addresse, req.body.ville, req.body.codePostal, 2, req.jwt.Email], function(err2, result2){
            return res.send({success: !err});
        });
    });
});

app.delete('/deleteBank', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN),
    check('name').isAlphanumeric().escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {
    //TODO transfert all clients funds to BRH?
    if (req.jwt.Banque === req.query.name){
        return res.send({error: "Administrator is not allowed to be deleted!"});
    }
    conn.query(sql.deleteBank_0_1, [req.query.name], function(err, result){
		return res.send({ succes: !err && result.affectedRows != 0});
	});
});


app.delete('/deleteMonnieElectronique', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN),
    check('name').isLength({ min: 1 }).matches(/^[a-z0-9 ]+$/i).escape().trim(),

//    check('name').isAlphanumeric().escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {
    //TODO transfert all clients funds to BRH?
    if (req.jwt.Banque === req.query.name){
        return res.send({error: "Administrator is not allowed to be deleted!"});
    }
    conn.query(sql.deleteMonnie, [req.query.name], function(err, result){
		return res.send({ succes: !err && result.affectedRows != 0});
	});
});

app.delete('/deleteParametre', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN),
    check('id').isAlphanumeric().escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {
    //TODO transfert all clients funds to BRH?
    if (req.jwt.Banque === req.query.name){
        return res.send({error: "Administrator is not allowed to be deleted!"});
    }
    conn.query(sql.deleteParametre, [req.query.id], function(err, result){
		return res.send({ succes: !err && result.affectedRows != 0});
	});
});

app.delete('/deletePortefeuille', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.BANQUE),
    check('id').isNumeric().isLength({min: 1}),
    outils.handleValidationResult], 
    function(req, res) {
    
    conn.query(sql.findPortefeuillesById, [req.query.id], function(err, result){
        if(err || !result[0]) return res.status(404).send({ succes: false, errors: ["portefeuille not found!"] });
        conn.query(sql.findUtilisateurByEmail, [result[0].Utilisateur_Email], function(err1, result1){
            if(err1 || !result1[0]) return res.status(404).send({ succes: false, errors: ["user not found!"] });
            if(req.jwt.PermissionLevel == config.permissionLevels.BANQUE && req.jwt.Banque != result1[0].Banque)
                return res.status(405).send({ succes: false, errors: ["You don't own that user!"] });
            conn.query(sql.deletePortefeuille, [req.query.id], function(err3, result3){
                return res.send({success: !err3 && result3.affectedRows != 0});
            });
        });
    });
});

app.delete('/deleteClient', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.BANQUE),
    check('email').isEmail().normalizeEmail(),
    outils.handleValidationResult], 
    function(req, res) {

    conn.query(sql.findUtilisateurByEmail, [req.query.email], function(err, result){
        if(err || !result[0]) return res.status(404).send({ succes: false, errors: ["user not found!"] });
        if(req.jwt.PermissionLevel == config.permissionLevels.BANQUE && req.jwt.Banque != result[0].Banque)
            return res.status(405).send({ succes: false, errors: ["You don't own that user!"] });
        // TODO - transfert all funds to banque account ... use admin account to do it ...
        conn.query(sql.deleteClient_0_1, [req.query.email], function(err, result){
            return res.send({ succes: !err && result.affectedRows != 0});
        });
    });
});

app.delete('/deleteContact', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('email').isEmail().normalizeEmail(),
    outils.handleValidationResult], 
    function(req, res) {

    conn.query(sql.deleteContact_0_2, [req.jwt.Email, req.query.email], function(err, result){
		return res.send({ succes: !err && result.affectedRows != 0});
	});
});

app.delete('/deleteCarte', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('id').isNumeric().isLength({min: 1}),
    outils.handleValidationResult], 
    function(req, res) {
    conn.query(sql.deleteCarte, [req.query.id], function(err, result){
		return res.send({ succes: !err && result.affectedRows != 0});
	});
});

app.post('/submit', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 5 }).escape(),
    check('id').isNumeric().isLength({min: 1}),
    check('montant').isNumeric().isLength({min: 1}),
    check('memo').optional().matches(/^[a-zA-Z0-9 éèàô]+$/i).escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {
    const monPortefeuille = req.jwt.Portefeuilles.find(pt => pt.Id === req.body.id);
    if(!monPortefeuille) return res.status(404).send({ succes: false, errors: ["Mauvais ID!"] });
    conn.query(sql.findUtilisateurByEmail, [req.body.email], function(err, result){
        if(err || !result[0]) return res.status(404).send({ succes: false, errors: ["user not found!"] });
        conn.query(sql.findPortefeuillesByEmail, [req.body.email], function(err1, result1){
            if(err1 || !result1[0]) return res.status(404).send({ succes: false, errors: ["Ups, il semble " + req.body.email + " n\'a pas de portefeuille..."] });
            const publicKey = "/p2pkh/" + monPortefeuille.ClePub + "/";
            const untoAddress = "/p2pkh/" + result1[0].ClePub + "/";
            console.log("[INFO]: fromAddress : " + publicKey);
            console.log("[INFO]: untoAddress : " + untoAddress);
            conn.query(sql.findUtilisateurByEmail, [req.jwt.Email], function(err2, result2){
                if(err2 || !result2[0]) return res.status(404).send({ succes: false, errors: ["you are a ghost!"] });
                conn.query(sql.findPortefeuillesById, [req.body.id], function(err3, result3){
                    if(err3 || !result3[0]) return res.status(404).send({ succes: false, errors: ["Ups, il semble vous n\'avez pas de portefeuille..."] });
                    if(result3[0].Utilisateur_Email !== req.jwt.Email) return res.status(404).send({ succes: false, errors: ["Ce portefeuille ne vous apartient pas!"] });
                    req.transactionWallet = result3[0].ClePrive;
                    req.fromAddress = publicKey;
                    req.untoAddress = untoAddress;
                    return outils.transaction(req, res, openchainValCli);
                });
            });
        });
    });
});

app.post('/transferTo', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('id').isNumeric().isLength({min: 1}),
    check('password').isLength({ min: 5 }).escape(),
    check('clePubDestinataire').isAlphanumeric().escape(),
    check('montant').isNumeric().isLength({min: 1}),
    check('memo').matches(/^[a-zA-Z0-9 éèàô]+$/i).escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {
    
    // May need some extra validation... (check if password is correct, etc)
    conn.query(sql.findPortefeuillesById, [req.body.id], function(err, result){
        if(err || !result[0]) return res.status(404).send({ succes: false, errors: ["Ce portefeuille n\'existe pas..."] });
        if(result[0].Utilisateur_Email !== req.jwt.Email) return res.status(404).send({ succes: false, errors: ["Ce portefeuille ne vous apartient pas!"] });
        req.transactionWallet = result[0].ClePrive;
        req.fromAddress = "/p2pkh/" + result[0].ClePub + "/";
        req.untoAddress = "/p2pkh/" + req.body.clePubDestinataire + "/";
        console.log("[INFO]: transactionWallet : " + req.transactionWallet);
        console.log("[INFO]: fromAddress : " + req.fromAddress);
        console.log("[INFO]: untoAddress : " + req.untoAddress);
        return outils.transaction(req, res, openchainValCli);
    });
});

app.post('/transferToUserEmail', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('id').isNumeric().isLength({min: 1}),
    check('password').isLength({ min: 5 }).escape(),
    check('emailDestinataire').isEmail().escape(),
    check('montant').isNumeric().isLength({min: 1}),
    check('memo').matches(/^[a-zA-Z0-9 éèàô]+$/i).escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {
    
    conn.query(sql.findPortefeuillesById, [req.body.id], function(err, result){
        if(err || !result[0]) return res.status(404).send({ succes: false, errors: ["Ce portefeuille n\'existe pas..."] });
        if(result[0].Utilisateur_Email !== req.jwt.Email) return res.status(404).send({ succes: false, errors: ["Ce portefeuille ne vous apartient pas!"] });
        req.transactionWallet = result[0].ClePrive;
        req.fromAddress = "/p2pkh/" + result[0].ClePub + "/";
        conn.query(sql.findPortefeuillesByEmail, [req.body.emailDestinataire], function(err2, result2){
            if(err2 || !result2[0]) return res.status(400).send({errors: ['Aucun portefeuille correspond à cet adresse mail...']});
            req.untoAddress = "/p2pkh/" + result2[0].ClePub + "/";
            console.log("[INFO]: transactionWallet : " + req.transactionWallet);
            console.log("[INFO]: fromAddress : " + req.fromAddress);
            console.log("[INFO]: untoAddress : " + req.untoAddress);
            return outils.transaction(req, res, openchainValCli);
        });
    });
});
  
app.post('/issueDHTG', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN),
    check('password').isLength({ min: 5 }).escape(),
    check('id').isNumeric().isLength({min: 1}),
    check('montant').isNumeric().isLength({min: 1}),
    check('memo').optional().isAlphanumeric().escape(),
    outils.handleValidationResult], 
    function(req, res) {

    const monPortefeuille = req.jwt.Portefeuilles.find(pt => pt.Id === req.body.id);
    if(!monPortefeuille) return res.status(404).send({ succes: false, errors: ["Mauvais ID!"] });
    conn.query(sql.findUtilisateurByEmail, [req.jwt.Email], function(err, result){
        if(err || !result[0]) {
            console.error("Email not found in db : " + req.jwt.Email);
            return res.status(404).send({ succes: false, errors: ["you are a ghost!"] });
        }
        conn.query(sql.findPortefeuillesById, [req.body.id], function(err1, result1){
            if(err1 || !result1[0]) return res.status(404).send({ succes: false, errors: ["Ups, il semble vous n\'avez pas de portefeuille..."] });
            if(result1[0].Utilisateur_Email !== req.jwt.Email) return res.status(404).send({ succes: false, errors: ["Ce portefeuille ne vous apartient pas!"] });
            req.transactionWallet = result1[0].ClePrive;
            req.fromAddress = config.DHTGAssetPath;
            req.untoAddress = "/p2pkh/" + monPortefeuille.ClePub + "/";
            console.log("unto: " + req.untoAddress);
            return outils.transaction(req, res, openchainValCli);
        });
    });
});

app.post('/validateEmail', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.PUBLIC),
    check('token').isString().isLength(300).escape().trim(),
    outils.handleValidationResult
    ], function(req, res) {

    conn.query(sql.findRandomTokenByEmail, [req.jwt.Email], function(err1, result1) {
        if(err1 || !result1[0]) return res.status(404).send({errors: ['Token Intouvable']});
        let currDate = new Date().getTime();
        let tokenDate = Date.parse(result1[0].DateCreationToken);
        let diff = (currDate - tokenDate) / 1000;
        if (diff > 86400) return res.status(400).send({errors: ['Token Expire!']});
        if (result1[0].Token !== req.body.token) return res.status(400).send({errors: ['Mauvais Token!']});
        conn.query(sql.validateClientEmail, [req.jwt.Email], function(err2, result2) {
            if(err2) return res.status(500).send({errors: ['Erreur cote serveur!']});
            conn.query(sql.deleteRandomTokenByEmail, [req.jwt.Email], function (err3, result3) {
                return res.status(200).send({success: !err3});
            });
        });
    });
});

app.get('/reValidateEmailIfEmailExpired', [
    outils.validJWTNeeded,
    outils.minimumPermissionLevelRequired(config.permissionLevels.PUBLIC),
    outils.handleValidationResult
    ], function(req, res) {

    if (req.jwt.IsEmailVerified) return res.status(200).send({errors: ["Votre Email est deja valide!"]});
    conn.query(sql.deleteRandomTokenByEmail, [req.jwt.Email], function(err, result){
        let randomToken = cryptoRandom({length: 300, type: 'url-safe'});
        conn.query(sql.insertRandomToken, [req.jwt.Email, randomToken], function(err2, result2){
            if(err2) return res.status(500).send({success: !err2, errors: ["Server Error"]});
            req.body = {};
            req.body.email = req.jwt.Email;
            req.body.nom = req.jwt.Nom;
            req.body.prenom = req.jwt.Prenom;
            req.body.banque = req.jwt.Banque;
            createConfimationEmailText(req, randomToken);
            transporter.sendMail(HeplerOptions, (err3, info) => {
                if(err3) {
                    console.log("Error while sending Email!");
                    console.log(err3);
                    console.log(info);
                    return;
                }
                return res.send({success: !err3});
            });
        });
    });
});

app.post('/auth', [ 
    check('email').isEmail().normalizeEmail(), 
    check('password').isLength({ min: 5 }).escape(),
    outils.handleValidationResult
    ], function(req, res) {

    conn.query(sql.findUtilisateurByEmail, [req.body.email], function(err, result){
        if(err || !result[0]) return res.status(400).send({errors: ['Invalid e-mail or password']});
        result = result[0];
        console.log(result);
        conn.query(sql.findPortefeuillesByEmail, [req.body.email], function(err2, result2){
            if(err2 || !result2[0]) return res.status(400).send({errors: ['Ups, il semble vous n\'avez pas de portefeuille...']});
            database.queryWithCatch(sql.findLoginAttempts, [req.body.email], res, '', 400, false).then(loginAttemps => {
                let countLoginAttemps = 0;
                let failedAttempts = [null, null, null];
                let insertOrUpdateLoginAttempts = sql.insertLoginAttempts;
                let badLoginErrorMessage = 'Vous etez bloques a cause de trop d\'essays utilisant un mot de passe incorrecte! Veuillez contacter votre Banque!';
                if(loginAttemps[0]) {
                    insertOrUpdateLoginAttempts = sql.updateLoginAttempts;
                    countLoginAttemps = loginAttemps[0].LoginAttempts;
                    failedAttempts[0] = loginAttemps[0].Attempt1;
                    failedAttempts[1] = loginAttemps[0].Attempt2;
                    failedAttempts[2] = loginAttemps[0].Attempt3;
                    if(countLoginAttemps >= 3) {
                        countLoginAttemps += 1;
                        return database.queryWithCatch(insertOrUpdateLoginAttempts,
                            [countLoginAttemps, failedAttempts[0], failedAttempts[1], failedAttempts[2], req.body.email], res,
                            '', 403, false).then( () => { return res.status(403).send({ errors: [badLoginErrorMessage] }) } );
                    }
                }
                let passwordFields = result.Password.split('$');
                let salt = passwordFields[0];
                let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
                console.log(passwordFields);
                if (hash !== passwordFields[1]) {
                    countLoginAttemps += 1;
                    if(countLoginAttemps <= 3) {
                        const CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };
                        failedAttempts[countLoginAttemps - 1] = CURRENT_TIMESTAMP;
                        if (countLoginAttemps < 3) {
                            badLoginErrorMessage = 'E-mail ou mot de passe Invalide! Il vous reste ' + (3 - countLoginAttemps) + ' d\'essays';
                        } else {
                            const roles = ['Public', 'DemandeParticulier', 'DemandeCommercant', 'DemandeBanque', 'Particulier', 'Commercant', 'Banque'];
                            let roleId = roles.indexOf(result.Libelle);
                            if (roleId > 3) roleId -= 3;
                            console.log('Libelle ' + result.Libelle);
                            console.log('The Role IDDDD: ' + roleId);
                            database.queryWithCatch(sql.unBlockOrBlockClient_0_2, [roleId, clientStatus.Bloque, req.body.email], res, '', 403, false);
                        }
                    }
                    return database.queryWithCatch(insertOrUpdateLoginAttempts,
                        [countLoginAttemps, failedAttempts[0], failedAttempts[1], failedAttempts[2], req.body.email], res,
                        '', 403, false).then( () => { return res.status(403).send({ errors: [badLoginErrorMessage] }) } );
                }
                database.queryWithCatch(sql.deleteLoginAttempts, [req.body.email], res, '', 400, false);
                try {
                    let refreshId = req.body.email + config.jwt_secret;
                    let salt = crypto.randomBytes(16).toString('base64');
                    let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
                    aSecret = {};
                    aSecret.Email = req.body.email;
                    aSecret.Nom = result.Nom;
                    aSecret.Prenom = result.Prenom;
                    aSecret.PermissionLevel = result.PermissionLevel;
                    aSecret.Banque = result.Banque;
                    aSecret.Portefeuilles = [];
                    aSecret.IsEmailVerified = result.IsEmailVerified;
                    for(let i = 0; i < result2.length; i++){
                        aSecret.Portefeuilles.push({Id: result2[i].Id, Libelle: result2[i].Libelle, Ouverture: result2[i].Ouverture, ClePub: result2[i].ClePub});
                    }
                    aSecret.refreshKey = salt;
                    let token = jwt.sign(aSecret, config.jwt_secret, { expiresIn: config.jwt_expiration_in_seconds});
                    let b = Buffer.from(hash);
                    let refresh_token = b.toString('base64');
                    conn.query(sql.findContactsByEmail, [req.body.email], function(err3, result3){  
                        let contacts = [];
                        for(let i = 0; i < result3.length; i++){
                            contacts.push({Id: result3[i].Id, Libelle: result3[i].Libelle, Ajout: result3[i].Ajout, ClePub: result3[i].ClePub});
                        }
                        return res.status(201).send({
                            accessToken: token,
                            refreshToken: refresh_token,
                            email: aSecret.Email,
                            portefeuilles: aSecret.Portefeuilles,
                            contacts: contacts,
                            banque: aSecret.Banque,
                            nom: result.Nom,
                            prenom: result.Prenom,
                            civilite: result.Civilite,
                            situationFamiliale: result.Situation_Familiale,
                            profession: result.Profession,
                            secteurActivite: result.Secteur_Activite,
                            siret: result.Siret,
                            tel: result.Tel,
                            adresse: result.Adresse,
                            ville: result.Ville,
                            codePostal: result.Code_Postal,
                            statut: result.Status,
                            documents: result.Documents,
                            permission: result.Libelle,
                            isEmailVerified: result.IsEmailVerified});
                    });
                } catch (err) {
                    return res.status(500).send({errors: err});
                }
            });
        });
    });
});