import { Injectable } from '@angular/core';
import { Role } from './Role';
import { NodeapiService } from '../nodeapi.service';
import { CommonUtilsService } from '../common/common-utils.service';

@Injectable({
  providedIn: 'root',
})
export class SogebankService {
  displayLoginForm = true;
  isNewParticulier: boolean;
  totalSolde: string;
  totalCredit = '0';
  totalDebit = '0';

  constructor(
    private apiService: NodeapiService,
    private commonUtilsService: CommonUtilsService
  ) { }

  initPortfeuillesData(callback, callbackComponent) {
    if (this.apiService.portefeuilles && this.apiService.portefeuilles.length > 0) {
      for (const portefeuille of this.apiService.portefeuilles) {
        this.apiService.getTransactions(portefeuille.ClePub).subscribe(
          sub => {
            sub.subscribe( res => {
                portefeuille.Transactions = res;
            }, err => {
              console.log(err);
            }, () => {
              portefeuille.Solde = '0 DHTG';
              this.apiService.getRecord(portefeuille.ClePub).subscribe(
                data => {
                  if (data[0] && data[0].balance) {
                    portefeuille.Solde = this.commonUtilsService.numberToCurrencyString(data[0].balance);
                  }
                },
                error => {
                  console.log(error);
                },
                () => {
                  // Ensure that transaction processing is complete before returning
                  setTimeout(() => {
                    this.countTotals();
                    callback(callbackComponent);
                  }, 300);
                  });
            });
          });
      }
    }
  }

  countTotals() {
    let solde = 0;
    let credit = 0;
    let debit = 0;
    const currDate = new Date();
    currDate.setDate(currDate.getDate() - 30);
    const referenceDate = currDate.getTime() / 1000;
    this.apiService.portefeuilles.forEach( portefeuille => {
      let creditPortefeuille = 0;
      let debitPorteuille = 0;
      solde += portefeuille.Solde ? this.commonUtilsService.currencyStringtoNumber(portefeuille.Solde) : 0;
      if (portefeuille['Transactions']) {
        portefeuille['Transactions'].forEach( transaction => {
          if (transaction.Timestamp > referenceDate) {
            if (transaction.Montant < 0) {
              debitPorteuille += transaction.Montant;
            } else {
              creditPortefeuille += transaction.Montant;
            }
          }
        });
      }
      const activite = debitPorteuille + creditPortefeuille;
      credit += creditPortefeuille;
      debit += debitPorteuille;
      portefeuille.Activite = activite >= 0 ? '+' + this.commonUtilsService.numberToCurrencyString(activite)
        : this.commonUtilsService.numberToCurrencyString(activite);
    });
    this.totalSolde = this.commonUtilsService.numberToCurrencyString(solde);
    this.totalCredit = this.commonUtilsService.numberToCurrencyString(credit);
    this.totalDebit = this.commonUtilsService.numberToCurrencyString(debit);
  }

  formatRecentTransactionData() {
    const formattedTransactions = [];
    const currDate = new Date();
    currDate.setDate(currDate.getDate() - 30);
    const referenceDate = currDate.getTime() / 1000;
    for (const portefeuille of this.apiService.portefeuilles) {
      if (portefeuille['Transactions']) {
        portefeuille['Transactions'].forEach( transaction => {
          if (transaction.Timestamp >= referenceDate) {
            const date = new Date(0);
            date.setUTCSeconds(transaction.Timestamp);
            formattedTransactions.push({
              id: transaction.MutationHash,
              date: date.getDate() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear(),
              type: transaction.Nature,
              nature: this.determineNature(portefeuille.ClePub, transaction.Destinataire, transaction.Expediteur),
              montant: this.commonUtilsService.numberToCurrencyString(
                transaction.Montant >= 0 ? '+' + transaction.Montant : transaction.Montant),
              portefeuille: this.determinePortefeuille(portefeuille.ClePub, transaction.Destinataire, transaction.Expediteur)
            });
          }
        });
      }
    }
    return formattedTransactions;
  }

  formatTransactionsforWalletWithDate(portefeuille, startDate, endDate) {
    const formattedTransactions = [];
    const startDateTimestamp = startDate.getTime() / 1000;
    const endDateTimestamp = endDate.getTime() / 1000;
    if (portefeuille && portefeuille['Transactions']) {
      portefeuille['Transactions'].forEach( transaction => {
        if (transaction.Timestamp >= startDateTimestamp && transaction.Timestamp <= endDateTimestamp) {
          const date = new Date(0);
          date.setUTCSeconds(transaction.Timestamp);
          formattedTransactions.push({
            id: transaction.MutationHash,
            date: date.getDate() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear(),
            type: transaction.Nature,
            nature: this.determineNature(portefeuille.ClePub, transaction.Destinataire, transaction.Expediteur),
            montant: this.commonUtilsService.numberToCurrencyString(
              transaction.Montant >= 0 ? '+' + transaction.Montant : transaction.Montant),
            portefeuille: this.determinePortefeuille(portefeuille.ClePub, transaction.Destinataire, transaction.Expediteur)
          });
        }
      });
    }
    return formattedTransactions;
  }

  formatTransfersforWalletWithDate(portefeuille, startDate, endDate) {
    const formattedTransactions = [];
    const startDateTimestamp = startDate.getTime() / 1000;
    const endDateTimestamp = endDate.getTime() / 1000;
    if (portefeuille && portefeuille['Transactions']) {
      portefeuille['Transactions'].forEach( transaction => {
        if (transaction.Timestamp >= startDateTimestamp && transaction.Timestamp <= endDateTimestamp
            && transaction.Nature === 'Virement') {
          const date = new Date(0);
          date.setUTCSeconds(transaction.Timestamp);
          formattedTransactions.push({
            id: transaction.MutationHash,
            date: date.getDate() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear(),
            type: transaction.Nature,
            nature: this.determineNature(portefeuille.ClePub, transaction.Destinataire, transaction.Expediteur),
            montant: this.commonUtilsService.numberToCurrencyString(
              transaction.Montant >= 0 ? '+' + transaction.Montant : transaction.Montant),
            portefeuille: this.determinePortefeuille(portefeuille.ClePub, transaction.Destinataire, transaction.Expediteur)
          });
        }
      });
    }
    return formattedTransactions;
  }

  determineNature(clePub, destinataire, expediteur) {
    if (clePub !== destinataire) {
      return this.determineLibelle(destinataire);
    } else {
      return this.determineLibelle(expediteur);
    }
  }

  determinePortefeuille(clePub, destinataire, expediteur) {
    if (clePub === destinataire) {
      return this.determineLibelle(destinataire);
    } else {
      return this.determineLibelle(expediteur);
    }
  }

  determineLibelle(clePub) {
    const libelle = this.getPortefeuilleLibelle(clePub);
    return libelle === undefined ? this.getContactLibelle(clePub) : libelle;
  }

  getPortefeuilleLibelle(clePub) {
    const libelle = this.apiService.portefeuilles.find(portefeuille => portefeuille.ClePub === clePub);
    return libelle === undefined ? undefined : libelle.Libelle;
  }

  getContactLibelle(clePub) {
    const libelleContact = this.apiService.contacts.find(contact => contact.ClePub === clePub);
    return libelleContact === undefined ? 'Inconnu' : libelleContact.Libelle;
  }
}
