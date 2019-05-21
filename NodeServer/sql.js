module.exports = {
  //REQUETTE_outputParams_inputParams
  "findClientByEmail_4_1" : "SELECT Password FROM OpenchainUser.utilisateur WHERE Email LIKE BINARY ?",
  "findClientByEmail_2_1" : "SELECT Address, Banque FROM OpenchainUser.Client WHERE Email LIKE BINARY ?",
  "findClientsByBanque_5_1" : "SELECT Email, Address, Nom, Prenom FROM OpenchainUser.Client WHERE Banque LIKE BINARY ?",
  "insertBankClient_0_5" : "INSERT INTO OpenchainUser.Client (Email, Password, Wallet, Address, Banque, PermissionLevel) VALUES (?,?,?,?,?,2)",
  "insertBanque_0_3" : "INSERT INTO OpenchainUser.banque (Nom,Email,Tel) VALUES (?,?,?)",
  "insertContact_0_4" : "INSERT INTO OpenchainUser.Contact  (EmailProprietaire, EmailContact, Nom, Prenom) VALUES (?,?,?,?)",
  "getAllClients_5_0" : "SELECT Email, Address, Nom, Prenom, Banque FROM OpenchainUser.Client",
  "getAllBanks_1_0" : "SELECT Nom, Email, Tel FROM OpenchainUser.banque",
  "getAllBanks_NotVisible" : "SELECT Nom FROM OpenchainUser.banque WHERE isVisible=0",
  "getAllBanks_Visible" : "SELECT Nom, Email, Tel FROM OpenchainUser.banque WHERE isVisible=1",
  "deleteBank_0_1" : "DELETE FROM OpenchainUser.banque WHERE Nom=?",
  "deleteClient_0_1" : "DELETE FROM OpenchainUser.Client WHERE Email=?",
  "deleteContact_0_2" : "DELETE FROM OpenchainUser.Contact WHERE EmailProprietaire=? AND EmailContact=?",
  "blockClient_0_1" : "UPDATE OpenchainUser.Client SET PermissionLevel = 0 WHERE Email=?",
  "unBlockClient_0_1" : "UPDATE OpenchainUser.Client SET PermissionLevel = 1 WHERE Email=?",
  "updateClient_0_8" : "UPDATE OpenchainUser.Client SET Email = ?, Nom = ?, Prenom = ?, Loc = ?, Password = ?, Wallet = ? WHERE Client.Email = ?",
  "updateBank_0_2" : "UPDATE OpenchainUser.Banque SET Name = ? WHERE Name = ?",

  'insertUtilisateur' : 
      'INSERT INTO OpenchainUser.utilisateur (Email, Password, Banque) VALUES (?,?,?)',
  'insertPortefeuille' : 
      'INSERT INTO OpenchainUser.portefeuille (Libelle, ClePub, ClePrive, Utilisateur_Email) VALUES (?,?,?,?)',
  'findUtilisateurByEmail' : 
      'SELECT Email, Password, Nom, Prenom, Civilite, Situation_Familiale, Profession, Siret, Tel, Adresse, Ville, Code_Postal, Documents, Banque, Libelle, PermissionLevel ' + 
      'FROM OpenchainUser.utilisateur ut INNER JOIN OpenchainUser.role rl ON ut.Role_Id = rl.Id WHERE Email LIKE BINARY ?',
  'findPortefeuillesByEmail' :
      'SELECT Libelle, ClePub, ClePrive, Utilisateur_Email FROM OpenchainUser.portefeuille WHERE Utilisateur_Email LIKE BINARY ?'
}