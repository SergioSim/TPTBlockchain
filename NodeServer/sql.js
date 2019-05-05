module.exports = {
  //REQUETTE_outputParams_inputParams
  "findClientByEmail_4_1" : "SELECT Password, Address, Wallet, PermissionLevel FROM OpenchainUser.Client WHERE Email LIKE BINARY ?",
  "findClientsByBanque_5_1" : "SELECT Email, Address, Nom, Prenom FROM OpenchainUser.Client WHERE Banque LIKE BINARY ?",
  "insertClient_0_5" : "INSERT INTO OpenchainUser.Client  (Email, Password, Wallet, Address, Banque) VALUES (?,?,?,?,?)",
  "getAllClients_5_0" : "SELECT Email, Address, Nom, Prenom, Banque FROM OpenchainUser.Client"
}