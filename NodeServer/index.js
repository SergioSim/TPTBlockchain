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
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Authorization, Content-Type, X-Requested-With, Range, X-Content-Type-Options');
    console.log("[REQUEST] " + req.url + " : " + util.inspect(req.body, {showHidden: false, depth: null}));
    next();
});

server.listen(config.port);
console.log("Serveur lancé sur le port : " + config.port);

openchainValCli.initialize().then( function(res) {
    console.log("Openchain initialized: " + openchainValCli.namespace.toHex());
});

app.get('/allBanks', function(req, res) {
    let aQuerry = sql.getAllBanks;
    if(req.query.visible === 'true') aQuerry = sql.getAllBanks_Visible;
    if(req.query.visible === 'false') aQuerry = sql.getAllBanks_NotVisible;
    conn.query(aQuerry, function(err, result){
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
    conn.query(sql.findClientsByBanque, [req.query.banque], function(err, result){
        res.send((err) ? "Error" : result);
    });
});

app.get('/allClients', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN)], 
    function(req, res) {

    conn.query(sql.getAllClients, function(err, result){
        res.send((err) ? "Error" : result);
    });
});

app.post('/createBank', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN),
    check('name').isAlphanumeric().escape().trim(),
    check('email').isEmail().escape().trim(),
    check('telephone').isMobilePhone().escape().trim(),
    outils.handleValidationResult],
    function(req, res) {
    
    conn.query(sql.insertBanque_0_3, [req.body.name,req.body.email,req.body.telephone], function(err, result) { 
        return res.send({success: !err});
    });
});

app.post('/createClient', [
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 5 }).escape(),
    check('prenom').isLength({ min: 3 }),
    check('nom').isLength({ min: 3 }),
    check('banque').isLength({ min: 1 }).isAlphanumeric().escape().trim(),
    check('roleId').isLength({ min: 1 }).isNumeric().isIn([1,2]),
    outils.handleValidationResult], 
    function(req, res) {
    keys = outils.generateEncryptedKeys(req.body.password);
    req.body.password = outils.hashPassword(req.body.password);
    conn.query(sql.insertUtilisateur, [req.body.email, req.body.password, req.body.nom, req.body.prenom, req.body.banque, req.body.roleId], function(err, result) {
        if(err) return res.send({success: !err});
        conn.query(sql.insertPortefeuille, ['Portefeuille Principal', keys.address, keys.privateKey, req.body.email], function(err2, result2){
            return res.send({success: !err});
        });
    });
});

app.post('/createPortefeuille', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('password').isLength({ min: 5 }).escape(),
    check('libelle').isLength({ min: 1 }).isAlphanumeric().escape().trim(),
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
        conn.query(sql.insertPortefeuille, [req.body.libelle, keys.address, keys.privateKey, req.jwt.Email], function(err2, result2){
            return res.send({success: !err2});
    });
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

app.put('/updateBanque', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.BANQUE),
    check('banqueNew').isLength({ min: 1 }).isAlphanumeric().escape().trim(),
    check('banqueOld').optional().isLength({ min: 1 }).isAlphanumeric().escape().trim(),
    outils.handleValidationResult], 
    function(req, res) {
    
    let aBanqueOld = req.jwt.Banque;
    console.log('permission level : ' + req.jwt.PermissionLevel);
    if(req.jwt.PermissionLevel >= 3 && req.body.banqueOld != undefined)
        aBanqueOld = req.body.banqueOld;
    console.log('banque old = ' + aBanqueOld);
    conn.query(sql.updateBank_0_2, [req.body.banqueNew, aBanqueOld], function(err, result){
        return res.send({ succes: !err && result.affectedRows != 0});
    });
});

app.put('/updateClient', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.PUBLIC),
    check('email').optional().isEmail().normalizeEmail(),
    check('bankEmail').optional().isEmail().normalizeEmail(),
    check('nom').optional().isAlpha().escape().trim(),
    check('prenom').optional().isAlpha().escape().trim(),
    check('civilite').optional().isAlpha().escape().trim(),
    check('situation_familiale').optional().isAlpha().escape().trim(),
    check('profession').optional().isAlpha().escape().trim(),
    check('siret').optional().isAlpha().escape().trim(),
    check('tel').optional().isMobilePhone().escape().trim(),
    check('adresse').optional().isString().escape(),
    check('ville').optional().isString().escape(),
    check('code_postal').optional().isString().escape(),
    check('oldPassword').optional().isLength({ min: 5 }).escape(),
    check('newPassword').optional().isLength({ min: 5 }).escape(),
    outils.handleValidationResult], 
    function(req, res) {

    let aOldEmail = req.jwt.Email;
    if(req.jwt.PermissionLevel >= 2 && req.body.bankEmail != undefined)
        aOldEmail = bankEmail;
    conn.query(sql.findUtilisateurByEmail, [aOldEmail], function(err, result){
        if(err || !result[0]) return res.status(404).send({ succes: false, errors: ["user not found!"] });
        if(req.jwt.PermissionLevel == config.permissionLevels.BANQUE && req.jwt.Banque != result[0].Banque)
            return res.status(405).send({ succes: false, errors: ["You don't own that user!"] });
        const aEmail = (req.body.email === undefined) ? aOldEmail : req.body.email;
        const aNom = outils.hasChanged(req.body.Nom, result[0].Nom);
        const aPrenom = outils.hasChanged(req.body.prenom, result[0].Prenom);
        const aCivilite = outils.hasChanged(req.body.civilite, result[0].Civilite);
        const asituation_familiale = outils.hasChanged(req.body.situation_familiale, result[0].Situation_Familiale);
        const aprofession = outils.hasChanged(req.body.profession, result[0].Profession);
        const asiret = outils.hasChanged(req.body.siret, result[0].Siret);
        const atel = outils.hasChanged(req.body.tel, result[0].Tel);
        const aadresse = outils.hasChanged(req.body.adresse, result[0].Adresse);
        const aville = outils.hasChanged(req.body.ville, result[0].Ville);
        const acode_postal = outils.hasChanged(req.body.code_postal, result[0].Code_postal);
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
        conn.query(sql.updateClient, [aEmail, aPassword, aNom, aPrenom, aCivilite,asituation_familiale, aprofession, asiret, atel, aadresse, aville, acode_postal, aOldEmail], function(err, result){
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

app.post('/createBankClient', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.ADMIN),
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 5 }).escape(),
    check('banque').isLength({ min: 1 }).isAlphanumeric().escape().trim(),
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
    check('email').isEmail().normalizeEmail(),
    check('nom').isLength({ min: 1 }).escape(),
    check('prenom').isLength({ min: 1 }).escape(),
    outils.handleValidationResult], 
    function(req, res) {

    conn.query(sql.insertContact_0_4, [req.jwt.Email, req.body.email, req.body.nom, req.body.prenom], function(err, result){
        return res.send({ succes: !err});
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

app.post('/submit', [
    outils.validJWTNeeded, 
    outils.minimumPermissionLevelRequired(config.permissionLevels.CLIENT),
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 5 }).escape(),
    check('id').isNumeric().isLength({min: 1}),
    check('montant').isNumeric().isLength({min: 1}),
    check('memo').optional().isAlphanumeric().escape(),
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
            let passwordFields = result.Password.split('$');
            let salt = passwordFields[0];
            let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
            console.log(passwordFields);
            if (hash !== passwordFields[1]) return res.status(400).send({errors: ['Invalid e-mail or password']});
            try {
                let refreshId = req.body.email + config.jwt_secret;
                let salt = crypto.randomBytes(16).toString('base64');
                let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
                aSecret = {};
                aSecret.Email = req.body.email;
                aSecret.PermissionLevel = result.PermissionLevel;
                aSecret.Banque = result.Banque;
                aSecret.Portefeuilles = [];
                for(let i = 0; i < result2.length; i++){
                    aSecret.Portefeuilles.push({Id: result2[i].Id, Libelle: result2[i].Libelle, ClePub: result2[i].ClePub});
                }
                aSecret.refreshKey = salt;
                let token = jwt.sign(aSecret, config.jwt_secret, { expiresIn: config.jwt_expiration_in_seconds});
                let b = Buffer.from(hash);
                let refresh_token = b.toString('base64');
                return res.status(201).send({
                    accessToken: token,
                    refreshToken: refresh_token,
                    email: aSecret.Email,
                    portefeuilles: aSecret.Portefeuilles,
                    banque: aSecret.Banque,
                    nom: result.Nom,
                    prenom: result.Prenom,
                    civilite: result.Civilite,
                    situation_familiale: result.Situation_Familiale,
                    profession: result.Profession,
                    siret: result.Siret,
                    tel: result.Tel,
                    adresse: result.Adresse,
                    ville: result.Ville,
                    code_postal: result.Code_Postal,
                    documents: result.Documents,
                    permission: result.Libelle});
            } catch (err) {
                return res.status(500).send({errors: err});
            }
        });
    });
});