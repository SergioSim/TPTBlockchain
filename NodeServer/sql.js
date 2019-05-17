module.exports = {
  //REQUETTE_outputParams_inputParams
  "findClientByEmail_4_1" : "SELECT Password, Address, Wallet, PermissionLevel, Banque FROM OpenchainUser.Client WHERE Email LIKE BINARY ?",
  "findClientByEmail_2_1" : "SELECT Address, Banque FROM OpenchainUser.Client WHERE Email LIKE BINARY ?",
  "findClientsByBanque_5_1" : "SELECT Email, Address, Nom, Prenom FROM OpenchainUser.Client WHERE Banque LIKE BINARY ?",
  "insertClient_0_5" : "INSERT INTO OpenchainUser.Client (Email, Password, Wallet, Address, Banque) VALUES (?,?,?,?,?)",
  "insertBankClient_0_5" : "INSERT INTO OpenchainUser.Client (Email, Password, Wallet, Address, Banque, PermissionLevel) VALUES (?,?,?,?,?,2)",
  "insertBanque_0_3" : "INSERT INTO OpenchainUser.Banque (Name) VALUES (?)",
  "insertContact_0_4" : "INSERT INTO OpenchainUser.Contact  (EmailProprietaire, EmailContact, Nom, Prenom) VALUES (?,?,?,?)",
  "getAllClients_5_0" : "SELECT Email, Address, Nom, Prenom, Banque FROM OpenchainUser.Client",
  "getAllBanks_1_0" : "SELECT Name FROM OpenchainUser.Banque",
  "deleteBank_0_1" : "DELETE FROM OpenchainUser.Banque WHERE Name=?",
  "deleteClient_0_1" : "DELETE FROM OpenchainUser.Client WHERE Email=?",
  "deleteContact_0_2" : "DELETE FROM OpenchainUser.Contact WHERE EmailProprietaire=? AND EmailContact=?",
  "blockClient_0_1" : "UPDATE OpenchainUser.Client SET PermissionLevel = 0 WHERE Email=?",
  "unBlockClient_0_1" : "UPDATE OpenchainUser.Client SET PermissionLevel = 1 WHERE Email=?",
  "updateClient_0_8" : "UPDATE OpenchainUser.Client SET Email = ?, Nom = ?, Prenom = ?, Loc = ?, Password = ?, Wallet = ? WHERE Client.Email = ?"
}