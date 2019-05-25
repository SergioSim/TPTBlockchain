module.exports = {

  'insertUtilisateur' : 
        'INSERT INTO OpenchainUser.utilisateur (Email, Password, Nom, Prenom, Banque, Role_Id) VALUES (?,?,?,?,?,?)',
  'insertUtilisateurBanque' : 
        'INSERT INTO OpenchainUser.utilisateur (Email, Password, Banque, Role_Id) VALUES (?,?,?,5)',
  'insertPortefeuille' : 
        'INSERT INTO OpenchainUser.portefeuille (Libelle, ClePub, ClePrive, Utilisateur_Email) VALUES (?,?,?,?)',
  'insertContact_0_4' : 
        'INSERT INTO OpenchainUser.beneficiaire  (Utilisateur_Email, Beneficiaire_Email, Nom, Prenom) VALUES (?,?,?,?)',
  'insertBanque_0_3' : 
        'INSERT INTO OpenchainUser.banque (Nom,Email,Tel,isVisible) VALUES (?,?,?,1)',
  'findUtilisateurByEmail' : 
        'SELECT Email, Password, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Banque, Libelle, PermissionLevel ' + 
        'FROM OpenchainUser.utilisateur ut INNER JOIN OpenchainUser.role rl ON ut.Role_Id = rl.Id WHERE Email LIKE BINARY ?',
  'findBanqueByName' : 
         'SELECT Email, Nom, Tel, isVisible ' + 
         'FROM OpenchainUser.banque WHERE Nom LIKE BINARY ?',
  'findPortefeuillesByEmail' :
        'SELECT Id, Libelle, Ouverture, ClePub, ClePrive, Utilisateur_Email FROM OpenchainUser.portefeuille WHERE Utilisateur_Email LIKE BINARY ?',
  'findPortefeuillesById' :
        'SELECT Id, Libelle, ClePub, ClePrive, Utilisateur_Email FROM OpenchainUser.portefeuille WHERE Id = ?',
  'findClientsByBanque' : 
        'SELECT Email, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Banque, ' +
        'GROUP_CONCAT(CONCAT(\'{Id:"\', Id ,\'" Libelle:"\', Libelle , \'", ClePub:"\', ClePub,\'"}\')) as Portefeuille ' + 
        'FROM OpenchainUser.utilisateur ut INNER JOIN OpenchainUser.portefeuille pt ON ut.Email = pt.Utilisateur_Email WHERE Banque LIKE BINARY ? GROUP BY ' + 
        'Email, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Banque',
  'getAllClients' : 
        'SELECT Email, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Banque, ' +
        'GROUP_CONCAT(CONCAT(\'{Id:"\', Id ,\'" Libelle:"\', Libelle , \'", ClePub:"\', ClePub,\'"}\')) as Portefeuille ' + 
        'FROM OpenchainUser.utilisateur ut INNER JOIN OpenchainUser.portefeuille pt ON ut.Email = pt.Utilisateur_Email GROUP BY ' + 
        'Email, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Banque',
  'getAllBanks' : 
        'SELECT Nom, Email, Tel FROM OpenchainUser.banque',
  'getAllBanks_NotVisible' : 
        'SELECT Nom, Email, Tel FROM OpenchainUser.banque WHERE isVisible=0',
  'getAllBanks_Visible' : 
        'SELECT Nom, Email, Tel FROM OpenchainUser.banque WHERE isVisible=1',
  'deleteBank_0_1' : 
        'DELETE FROM OpenchainUser.banque WHERE Nom=?',
  'deleteClient_0_1' : 
        'DELETE FROM OpenchainUser.utilisateur WHERE Email=?',
  'deleteContact_0_2' : 
        'DELETE FROM OpenchainUser.beneficiaire WHERE Utilisateur_Email=? AND Beneficiaire_Email=?',
  'deletePortefeuille' : 
        'DELETE FROM OpenchainUser.portefeuille WHERE Id=?',
  'updateBank_0_2' : 
        'UPDATE OpenchainUser.banque SET Nom = ? WHERE Nom = ?',
  'updateClient' : 
        'UPDATE OpenchainUser.utilisateur SET Email = ?, Password = ?, Nom = ?, Prenom = ?, Civilite = ?, Situation_Familiale = ?, Profession = ?, Siret = ?,' + 
        ' Tel = ?, Adresse = ?, Ville = ?, Code_Postal = ? WHERE Email = ?',
  'updatePortefeuille' : 
        'UPDATE OpenchainUser.portefeuille SET Libelle = ?, ClePub = ?, ClePrive = ? WHERE Utilisateur_Email = ?',
  'blockClient_0_1' : 
        'UPDATE OpenchainUser.utilisateur SET Role_Id = 0 WHERE Email=?',
  'unBlockClient_0_1' : 
        'UPDATE OpenchainUser.utilisateur SET Role_Id = 3 WHERE Email=?'

}