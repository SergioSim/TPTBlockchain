module.exports = {

  'insertUtilisateur' : 
        'INSERT INTO utilisateur (Email, Password, Nom, Prenom, Tel, Banque, Role_Id) VALUES (?,?,?,?,?,?,?)',
  'insertUtilisateurBanque' : 
        'INSERT INTO utilisateur (Email, Password, Banque, Role_Id) VALUES (?,?,?,6)',
  'insertPortefeuille' : 
        'INSERT INTO portefeuille (Libelle, ClePub, ClePrive, Utilisateur_Email, Ouverture) VALUES (?,?,?,?,?)',
  'insertContact_0_4' : 
        'INSERT INTO beneficiaire  (Utilisateur_Email, Libelle, ClePub, Ajout) VALUES (?,?,?,?)',
  'insertBanque_0_3' : 
        'INSERT INTO banque (NomCommercial, Email, Telephone, isVisible, Statut) VALUES (?,?,?,1,"en cours")',
  'insertTransactionMotif' : 
        'INSERT INTO motiftransaction (Mutation_Hash,Motif) VALUES (?,?)',
  'insertCommercantDocs' : 
        'INSERT INTO document (Email,Annonce_Legale) VALUES (?,?)',
  'insertParticulierDocs' : 
        'INSERT INTO document (Email,Piece_Identite,Justificatif_Domicile) VALUES (?,?,?)',
  'insertBanqueDocs' :
        'INSERT INTO document VALUES (?,?,?,?)',
  'insertRandomToken' : 'INSERT INTO tokenverification (Email, Token) VALUES (?,?)',
  'insertCarte' : 
        'INSERT INTO carte (Libelle,Portefeuille_id,Creation) VALUES (?,?,?)',
  'insertMonnie' : 
        'INSERT INTO monnie (Nom,Unite,Type) VALUES (?,?,?)',
  'insertParametre' :
        'INSERT INTO parametre (Nom, Description,Valeur) VALUES (?,?,?)',
  'findUtilisateurByEmail' : 
  'SELECT Email, Password, Nom, Prenom, Civilite, Situation_Familiale, Profession, Secteur_Activite, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Status, Banque, Libelle, PermissionLevel, IsEmailVerified ' + 
        'FROM utilisateur ut INNER JOIN role rl ON ut.Role_Id = rl.Id WHERE Email LIKE BINARY ?',
  'findCartesByPortefeuilleIds' : 
        'SELECT Id, Libelle, Portefeuille_Id, Creation, IsBlocked ' + 
        'FROM carte WHERE Portefeuille_Id IN (?)',
  'findMotifsByMutationHashes' : 
        'SELECT Mutation_Hash, Motif ' + 
        'FROM motiftransaction WHERE Mutation_Hash IN (?)',
  'findBanqueByName' : 
         'SELECT Email, NomCommercial, Telephone, isVisible ' + 
         'FROM banque WHERE NomCommercial LIKE BINARY ?',  
  'findPortefeuillesByBanqueEmail' :
  'SELECT Id, Libelle, Ouverture, ClePub, ClePrive, Utilisateur_Email FROM portefeuille WHERE Utilisateur_Email LIKE BINARY ?',
  'findPortefeuillesByEmail' :
        'SELECT Id, Libelle, Ouverture, ClePub, ClePrive, Utilisateur_Email FROM portefeuille WHERE Utilisateur_Email LIKE BINARY ?',
  'findContactsByEmail' :
        'SELECT Id, Libelle, Ajout, ClePub FROM beneficiaire WHERE Utilisateur_Email LIKE BINARY ?',
  'findPortefeuillesById' :
        'SELECT Id, Libelle, ClePub, ClePrive, Utilisateur_Email FROM portefeuille WHERE Id = ?',
  'findUtilisateursByBanque' : 
        'SELECT * FROM banque LEFT JOIN utilisateur ON banque.Email = utilisateur.Email ',
  'findEmailFromCartId' :
        'SELECT Utilisateur_Email FROM portefeuille pt INNER JOIN carte ca ON pt.Id = ca.Portefeuille_Id WHERE ca.Id = ?.',
  'findRandomTokenByEmail' : 'SELECT Token, DateCreationToken FROM tokenverification Where Email LIKE BINARY ?',
  'findClientsByBanque' : 
        'SELECT Email, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Status, Banque, Role_Id, IsEmailVerified, ' +
        'GROUP_CONCAT(CONCAT(\'{\"Id\":"\', Id ,\'", \"Libelle\":"\', Libelle , \'", \"ClePub\":"\', ClePub,\'"}\')) as Portefeuille ' + 
        'FROM utilisateur ut INNER JOIN portefeuille pt ON ut.Email = pt.Utilisateur_Email WHERE Banque LIKE BINARY ? GROUP BY ' + 
        'Email, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Banque',
  'getAllClients' : 
        'SELECT Email, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Status, Banque, Role_Id, IsEmailVerified, ' +
        'GROUP_CONCAT(CONCAT(\'{\"Id\":"\', Id ,\'", \"Libelle\":"\', Libelle , \'", \"ClePub\":"\', ClePub,\'"}\')) as Portefeuille ' + 
        'FROM utilisateur ut INNER JOIN portefeuille pt ON ut.Email = pt.Utilisateur_Email GROUP BY ' + 
        'Email, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Banque',
  'getAllMonnies' : 
        'SELECT Id, Nom, Unite, Type FROM monnie WHERE Type=?',
  'getAllPrametres' :
        'SELECT Id, Nom, Description, Valeur, DateCreation FROM parametre',
  'getAllBanks' : 
        'SELECT NomCommercial, Email, Telephone, Statut, Virement FROM banque',
  'getAllPortefeuilles' : 
        'SELECT NomCommercial, Email, Telephone, Virement FROM banque',
  'getAllBanks_NotVisible' : 
        'SELECT NomCommercial, Email, Telephone, Statut FROM banque WHERE isVisible=0',
  'getAllBanks_Visible' : 
        'SELECT NomCommercial, Email, Telephone, Statut FROM banque WHERE isVisible=1',
  'getAllBanks_Valid' : 
        'SELECT NomCommercial, Email, Telephone, Statut FROM banque WHERE Statut=? && NomCommercial!=?',
  'getAllBanks_NotValid' : 
        'SELECT NomCommercial, Email, Telephone, Statut FROM banque WHERE Statut!=? && isVisible=1',
  'getClientDocsByEmail':
        'SELECT Piece_Identite, Justificatif_Domicile, Annonce_Legale FROM document WHERE Email=?',
  'deleteParametre'  :
        'DELETE FROM parametre WHERE Id=?',
  'deleteMonnie' : 
        'DELETE FROM monnie WHERE Nom=?',
  'deleteBank_0_1' : 
        'DELETE FROM banque WHERE NomCommercial=?',
  'deleteClient_0_1' : 
        'DELETE FROM utilisateur WHERE Email=?',
  'deleteContact_0_2' : 
        'DELETE FROM beneficiaire WHERE Id=?',
  'deletePortefeuille' : 
        'DELETE FROM portefeuille WHERE Id=?',
  'deleteCarte' : 
        'DELETE FROM carte WHERE Id=?',
  'deleteRandomTokenByEmail' : 
        'DELETE FROM tokenverification WHERE Email = ?',
  'updateMonnie' : 
        'UPDATE monnie SET Nom=?, Unite = ?  WHERE Id = ?',
  'updateBank_0_2' : 
        'UPDATE banque SET NomCommercial = ?,  Email = ?, Telephone = ?, isVisible= ?, Statut=?, Virement=? WHERE NomCommercial = ?',
  'updateClient' : 
        'UPDATE utilisateur SET Email = ?, Password = ?, Nom = ?, Prenom = ?, Civilite = ?, Situation_Familiale = ?, Profession = ?, Siret = ?,' + 
        ' Tel = ?, Adresse = ?, Ville = ?, Code_Postal = ? WHERE Email = ?',
  'updateCommercantDocs' : 
        'UPDATE document SET Annonce_Legale = ? WHERE Email = ?',
  'updateParticulierDocs' : 
        'UPDATE document SET Piece_Identite = ?, Justificatif_Domicile = ? WHERE Email = ?',
  'updateCommercantInfo' : 
        'UPDATE utilisateur SET Statut_Juridique = ?, Siret = ?, Secteur_Activite = ?, Tel = ?,' + 
        ' Adresse = ?, Ville = ?, Code_Postal = ?, Status = ? WHERE Email = ?',
  'updateParticulierInfo' : 
        'UPDATE utilisateur SET Civilite = ?, Situation_Familiale = ?, Profession = ?,' + 
        ' Tel = ?, Adresse = ?, Ville = ?, Code_Postal = ?, Status = ? WHERE Email = ?',
  'updateParametre' :
        'UPDATE parametre SET Nom = ?, Description = ?, Valeur= ?  WHERE Id = ?',
  'updatePortefeuille' : 
        'UPDATE portefeuille SET Libelle = ?, ClePub = ?, ClePrive = ? WHERE Utilisateur_Email = ?',
  'updateContact' : 
        'UPDATE beneficiaire SET Libelle = ?, ClePub = ? WHERE Id = ?',
  'updateCarte' : 
        'UPDATE carte SET Libelle = ? WHERE Id = ?',
  'updatePortefeuilleLibelle' : 
        'UPDATE portefeuille SET Libelle = ? WHERE Id = ?',
  'blockClient_0_1' : 
        'UPDATE utilisateur SET Role_Id = 0 WHERE Email=?',
  'unBlockClient_0_1' : 
        'UPDATE utilisateur SET Role_Id = 4 WHERE Email=?',
  'blockCarte' : 
        'UPDATE carte SET IsBlocked = 1 WHERE Id=?',
  'unblockCarte' : 
        'UPDATE carte SET IsBlocked = 0 WHERE Id=?',
  'unBlockOrBlockClient_0_2' : 
        'UPDATE utilisateur SET Role_Id = ? WHERE Email=?',
  'unBlockBanque' : 
        'UPDATE utilisateur SET Role_Id = 6 WHERE Email=?',
  'validateClientEmail' :
        'UPDATE utilisateur SET IsEmailVerified = 1 WHERE Email=?'

}