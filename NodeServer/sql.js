module.exports = {
  "insertBankClient_0_5" : "INSERT INTO OpenchainUser.Client (Email, Password, Wallet, Address, Banque, PermissionLevel) VALUES (?,?,?,?,?,2)",
  "updateClient_0_8" : "UPDATE OpenchainUser.Client SET Email = ?, Nom = ?, Prenom = ?, Loc = ?, Password = ?, Wallet = ? WHERE Client.Email = ?",

  'insertUtilisateur' : 
        'INSERT INTO OpenchainUser.utilisateur (Email, Password, Banque) VALUES (?,?,?)',
  'insertPortefeuille' : 
        'INSERT INTO OpenchainUser.portefeuille (Libelle, ClePub, ClePrive, Utilisateur_Email) VALUES (?,?,?,?)',
  'insertContact_0_4' : 
        'INSERT INTO OpenchainUser.beneficiaire  (Utilisateur_Email, Beneficiaire_Email, Nom, Prenom) VALUES (?,?,?,?)',
  'insertBanque_0_3' : 
        'INSERT INTO OpenchainUser.banque (Nom,Email,Tel,isVisible) VALUES (?,?,?,1)',
  'findUtilisateurByEmail' : 
        'SELECT Email, Password, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Banque, Libelle, PermissionLevel ' + 
        'FROM OpenchainUser.utilisateur ut INNER JOIN OpenchainUser.role rl ON ut.Role_Id = rl.Id WHERE Email LIKE BINARY ?',
  'findPortefeuillesByEmail' :
        'SELECT Libelle, ClePub, ClePrive, Utilisateur_Email FROM OpenchainUser.portefeuille WHERE Utilisateur_Email LIKE BINARY ?',
  'findClientsByBanque' : 
        'SELECT Email, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Banque, ' +
        'GROUP_CONCAT(CONCAT(\'{Libelle:"\', Libelle , \'", ClePub:"\', ClePub,\'"}\')) as Portefeuille ' + 
        'FROM OpenchainUser.utilisateur ut INNER JOIN OpenchainUser.portefeuille pt ON ut.Email = pt.Utilisateur_Email WHERE Banque LIKE BINARY ? GROUP BY ' + 
        'Email, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Banque',
  'getAllClients' : 
        'SELECT Email, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Banque, ' +
        'GROUP_CONCAT(CONCAT(\'{Libelle:"\', Libelle , \'", ClePub:"\', ClePub,\'"}\')) as Portefeuille ' + 
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
  'updateBank_0_2' : 
        'UPDATE OpenchainUser.banque SET Name = ? WHERE Name = ?',
  'blockClient_0_1' : 
        'UPDATE OpenchainUser.utilisateur SET Role_Id = 0 WHERE Email=?',
  'unBlockClient_0_1' : 
        'UPDATE OpenchainUser.utilisateur SET Role_Id = 1 WHERE Email=?',
}