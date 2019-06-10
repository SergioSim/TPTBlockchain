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
          sub => sub.subscribe( res => {
            console.log(res);
            portefeuille.Transactions = res;
            if (portefeuille.Transactions && portefeuille.Transactions.length > 0) {
              portefeuille.Solde = this.commonUtilsService.numberToCurrencyString(portefeuille.Transactions[0].Solde);
            } else {
              // If no transactions, get balance manually
              this.apiService.getRecord(portefeuille.ClePub).subscribe(
                data => {
                  if (data[0] && data[0].balance) {
                    portefeuille.Solde = this.commonUtilsService.numberToCurrencyString(data[0].balance);
                  } else {
                    portefeuille.Solde = 0;
                  }
                },
                error => {
                  console.log(error);
                });
              }
            }, err => {
              console.log(err);
            }, () => {
              this.countTotals();
              callback(callbackComponent);
            }));
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
      solde += this.commonUtilsService.currencyStringtoNumber(portefeuille.Solde);
      portefeuille['Transactions'].forEach( transaction => {
        if (transaction.Timestamp > referenceDate) {
          if (transaction.Montant < 0) {
            debit += transaction.Montant;
          } else {
            credit += transaction.Montant;
          }
        }
      });
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
      portefeuille['Transactions'].forEach( transaction => {
        if (transaction.Timestamp >= referenceDate) {
          const date = new Date(0);
          date.setUTCSeconds(transaction.Timestamp);
          formattedTransactions.push({
            id: transaction.MutationHash,
            date: date.getDate() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear(),
            type: transaction.Nature,
            nature: transaction.Expediteur,
            montant: this.commonUtilsService.numberToCurrencyString(
              transaction.Montant >= 0 ? '+' + transaction.Montant : transaction.Montant),
            portefeuille: transaction.Destinataire
          });
        }
      });
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
            nature: transaction.Expediteur,
            montant: this.commonUtilsService.numberToCurrencyString(
              transaction.Montant >= 0 ? '+' + transaction.Montant : transaction.Montant),
            portefeuille: transaction.Destinataire
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
            nature: transaction.Expediteur,
            montant: this.commonUtilsService.numberToCurrencyString(
              transaction.Montant >= 0 ? '+' + transaction.Montant : transaction.Montant),
            portefeuille: transaction.Destinataire
          });
        }
      });
    }
    return formattedTransactions;
  }

  getUserContacts() {
    return [
      {id: 3, libelle: 'Marcus Dooling', ajout: '14/01/2019'},
      {id: 4, libelle: 'Oleta Ulrich', ajout: '16/02/2019'},
    ];
  }

}
