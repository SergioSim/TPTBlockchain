module.exports = {

  'insertUtilisateur' : 
        'INSERT INTO utilisateur (Email, Password, Nom, Prenom, Banque, Role_Id) VALUES (?,?,?,?,?,?)',
  'insertUtilisateurBanque' : 
        'INSERT INTO utilisateur (Email, Password, Banque, Role_Id) VALUES (?,?,?,5)',
  'insertPortefeuille' : 
        'INSERT INTO portefeuille (Libelle, ClePub, ClePrive, Utilisateur_Email, Ouverture) VALUES (?,?,?,?,?)',
  'insertContact_0_4' : 
        'INSERT INTO beneficiaire  (Utilisateur_Email, Libelle, ClePub, Ajout) VALUES (?,?,?,?)',
  'insertBanque_0_3' : 
        'INSERT INTO banque (Nom,Email,Tel,isVisible,Statut) VALUES (?,?,?,1,"en cours")',
  'insertCommercantDocs' : 
        'INSERT INTO document (Status,Annonce_Legale) VALUES (2,?) WHERE Id = ?',
  'insertParticulierDocs' : 
        'INSERT INTO document (Status,Piece_Identite,Justificatif_Domicile) VALUES (2,?,?) WHERE Id = ?',
  'insertCarte' : 
        'INSERT INTO carte (Libelle,Portefeuille_id,Creation) VALUES (?,?,?)',
  'insertMonnie' : 
        'INSERT INTO monnie (Nom,Unite,Type) VALUES (?,?,?)',
  'insertParametre' :
        'INSERT INTO parametre (Nom, Description, DateCreation) VALUES (?,?,?)',
  'findUtilisateurByEmail' : 
  'SELECT Email, Password, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Status, Banque, Libelle, PermissionLevel ' + 
        'FROM utilisateur ut INNER JOIN role rl ON ut.Role_Id = rl.Id WHERE Email LIKE BINARY ?',
  'findCartesByPortefeuilleIds' : 
        'SELECT Id, Libelle, Portefeuille_Id, Creation ' + 
        'FROM carte WHERE Portefeuille_Id IN (?)',
  'findBanqueByName' : 
         'SELECT Email, Nom, Tel, isVisible ' + 
         'FROM banque WHERE Nom LIKE BINARY ?',    
  'findPortefeuillesByEmail' :
        'SELECT Id, Libelle, Ouverture, ClePub, ClePrive, Utilisateur_Email FROM portefeuille WHERE Utilisateur_Email LIKE BINARY ?',
  'findContactsByEmail' :
        'SELECT Id, Libelle, Ajout, ClePub FROM beneficiaire WHERE Utilisateur_Email LIKE BINARY ?',
  'findPortefeuillesById' :
        'SELECT Id, Libelle, ClePub, ClePrive, Utilisateur_Email FROM portefeuille WHERE Id = ?',
  'findClientsByBanque' : 
        'SELECT Email, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Status, Banque, Role_Id,  ' +
        'GROUP_CONCAT(CONCAT(\'{\"Id\":"\', Id ,\'", \"Libelle\":"\', Libelle , \'", \"ClePub\":"\', ClePub,\'"}\')) as Portefeuille ' + 
        'FROM utilisateur ut INNER JOIN portefeuille pt ON ut.Email = pt.Utilisateur_Email WHERE Banque LIKE BINARY ? GROUP BY ' + 
        'Email, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Banque',
  'getAllClients' : 
        'SELECT Email, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Status, Banque, Role_Id, ' +
        'GROUP_CONCAT(CONCAT(\'{\"Id\":"\', Id ,\'", \"Libelle\":"\', Libelle , \'", \"ClePub\":"\', ClePub,\'"}\')) as Portefeuille ' + 
        'FROM utilisateur ut INNER JOIN portefeuille pt ON ut.Email = pt.Utilisateur_Email GROUP BY ' + 
        'Email, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Banque',
  'getAllMonnies' : 
        'SELECT Id, Nom, Unite, Type FROM monnie WHERE Type=?',
  'getAllPrametres' :
        'SELECT Id, Nom, Description, DateCreation FROM parametre',
  'getAllBanks' : 
        'SELECT Nom, Email, Tel, Statut FROM banque',
  'getAllBanks_NotVisible' : 
        'SELECT Nom, Email, Tel, Statut FROM banque WHERE isVisible=0',
  'getAllBanks_Visible' : 
        'SELECT Nom, Email, Tel, Statut FROM banque WHERE isVisible=1',
  'getAllBanks_Valid' : 
        'SELECT Nom, Email, Tel, Statut FROM banque WHERE Statut=? && Nom!=?',
  'getAllBanks_NotValid' : 
        'SELECT Nom, Email, Tel, Statut FROM banque WHERE Statut!=? && isVisible=1',
  'deleteParametre'  :
        'DELETE FROM parametre WHERE Id=?',
  'deleteMonnie' : 
        'DELETE FROM monnie WHERE Nom=?',
  'deleteBank_0_1' : 
        'DELETE FROM banque WHERE Nom=?',
  'deleteClient_0_1' : 
        'DELETE FROM utilisateur WHERE Email=?',
  'deleteContact_0_2' : 
        'DELETE FROM beneficiaire WHERE Id=?',
  'deletePortefeuille' : 
        'DELETE FROM portefeuille WHERE Id=?',
  'deleteCarte' : 
        'DELETE FROM carte WHERE Id=?',
  'updateMonnie' : 
        'UPDATE monnie SET Nom=?, Unite = ?  WHERE Id = ?',
  'updateBank_0_2' : 
        'UPDATE banque SET Nom = ?,  Email = ?, Tel = ?, isVisible= ?, Statut=? WHERE Nom = ?',
  'updateClient' : 
        'UPDATE utilisateur SET Email = ?, Password = ?, Nom = ?, Prenom = ?, Civilite = ?, Situation_Familiale = ?, Profession = ?, Siret = ?,' + 
        ' Tel = ?, Adresse = ?, Ville = ?, Code_Postal = ? WHERE Email = ?',
  'updateCommercantInfo' : 
        'UPDATE utilisateur SET Statut_Juridique = ?, Siret = ?, Secteur_Activite = ?, Tel = ?,' + 
        ' Adresse = ?, Ville = ?, Code_Postal = ? WHERE Email = ?',
  'updateParticulierInfo' : 
        'UPDATE utilisateur SET Civilite = ?, Situation_Familiale = ?, Profession = ?,' + 
        ' Tel = ?, Adresse = ?, Ville = ?, Code_Postal = ? WHERE Email = ?',
  'updateParametre' :
        'UPDATE parametre SET Nom = ?, Description = ?  WHERE Id = ?',
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
        'UPDATE utilisateur SET Role_Id = 3 WHERE Email=?',
  'unBlockBanque' : 
        'UPDATE utilisateur SET Role_Id = 5 WHERE Email=?'

}