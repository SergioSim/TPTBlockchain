module.exports = {
  //REQUETTE_outputParams_inputParams
  "findClientByEmail_4_1" : "SELECT Password, Address, Wallet, PermissionLevel, Banque FROM OpenchainUser.Client WHERE Email LIKE BINARY ?",
  "findClientByEmail_2_1" : "SELECT Address, Banque FROM OpenchainUser.Client WHERE Email LIKE BINARY ?",
  "findClientsByBanque_5_1" : "SELECT Email, Address, Nom, Prenom FROM OpenchainUser.Client WHERE Banque LIKE BINARY ?",
  "insertClient_0_5" : "INSERT INTO OpenchainUser.Client (Email, Password, Wallet, Address, Banque) VALUES (?,?,?,?,?)",
  "insertBanque_0_3" : "INSERT INTO OpenchainUser.Banque (Name) VALUES (?)",
  "insertContact_0_4" : "INSERT INTO OpenchainUser.Contact  (EmailProprietaire, EmailContact, Nom, Prenom) VALUES (?,?,?,?)",
  "getAllClients_5_0" : "SELECT Email, Address, Nom, Prenom, Banque FROM OpenchainUser.Client",
  "deleteContact_0_2" : "DELETE FROM OpenchainUser.Contact WHERE EmailProprietaire=? AND EmailContact=?"
}