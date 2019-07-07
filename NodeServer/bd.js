const config = require('./env.config.js'),
      mysql  = require('mysql');

exports.Database = class Database {
  constructor() {
      this.connection = mysql.createConnection({host: config.mySqlHost , user: config.mySqlUser, password: config.mySqlPass, database: config.mySqlUser});
  }
  queryWithCatch( sql, args, res, errorMessage, errorCode = 400, sendError = true) {
    return new Promise( ( resolve, reject ) => {
        this.connection.query( sql, args, ( err, rows ) => {
            if(err || !rows) {
              return reject({err, rows});
            }
            return resolve(rows);
        } );
    }).catch(error => {
      console.log("[DATABASE ERROR]", "Result:", error.rows, "Error:", error.err);
      if(sendError) {
        res.status(errorCode).send({ succes: false, errors: [errorMessage] });
      }
    });
  }
}

exports.banque = {
  table: 'OpenchainUser.banque',
  Nom: 'Nom',
  Email: 'Email',
  Tel: 'Tel',
  isVisible: 'isVisible'
}

exports.role = {
  table: 'OpenchainUser.role',
  Id: 'Id',
  Libelle: 'Libelle',
  PermissionLevel: 'PermissionLevel',
}

exports.utilisateur = {
  table: 'OpenchainUser.utilisateur',
  Email: 'Email',
  Password: 'Password',
  Nom: 'Nom',
  Prenom: 'Prenom',
  Civilite: 'Civilite',
  Situation_Familiale: 'Situation_Familiale',
  Profession: 'Profession',
  Siret: 'Siret',
  Tel: 'Tel',
  Adresse: 'Adresse',
  Ville: 'Ville',
  Code_Postal: 'Code_Postal',
  Documents: 'Documents',
  Status: 'Status',
  Banque: 'Banque',
  Role_Id: 'Role_Id'
}

exports.beneficiaire = {
  table: 'OpenchainUser.beneficiaire',
  Id: 'Id',
  Utilisateur_Email: 'Utilisateur_Email',
  Libelle: 'Libelle',
  ClePub: 'ClePub',
  Ajout: 'Ajout'
}

exports.portefeuille = {
  table: 'OpenchainUser.portefeuille',
  Id: 'Id',
  Utilisateur_Email: 'Utilisateur_Email',
  Libelle: 'Libelle',
  Ouverture: 'Ouverture',
  ClePub: 'ClePub',
  ClePrive: 'ClePrive',
}

exports.document = {
  table: 'OpenchainUser.document',
  Id: 'Id',
  Piece_Identite: 'Piece_Identite',
  Justificatif_Domicile: 'Justificatif_Domicile',
  Annonce_Legale: 'Annonce_Legale'
}

exports.status = {
  table: 'OpenchainUser.status',
  Id: 'Id',
  Libelle: 'Libelle'
}

exports.carte = {
  table: 'OpenchainUser.carte',
  Id: 'Id',
  Libelle: 'Libelle',
  Portefeuile_Id: 'Portefeuile_Id'
}

exports.motiftransaction = {
  table: 'OpenchainUser.motiftransaction',
  Mutation_Hash: 'Mutation_Hash',
  Motif: 'Motif'
}

// (arg1, arg2, arg3)
function args() {
  return ' (' + largs.apply(null, arguments) + ')'; 
}
//arg1, arg2, arg3
function largs() {
  let res = '';
  for (let i = 0; i < arguments.length - 1; i++) {
    res = res + arguments[i] + ', ';
  }
  res = res + arguments[arguments.length-1];
  return res;
}