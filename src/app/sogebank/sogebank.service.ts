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
  totalCredit: string;
  totalDebit: string;

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
    const referenceDate = currDate.getTime();
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

  formatTransactionData() {
    const formattedTransactions = [];
    for (const portefeuille of this.apiService.portefeuilles) {
      portefeuille['Transactions'].forEach( transaction => {
        const date = new Date(0);
        date.setUTCSeconds(transaction.Timestamp);
        formattedTransactions.push({
          id: transaction.MutationHash,
          date: date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear(),
          type: transaction.Nature,
          nature: transaction.Expediteur,
          montant: this.commonUtilsService.numberToCurrencyString(
            transaction.Montant >= 0 ? '+' + transaction.Montant : transaction.Montant),
          portefeuille: transaction.Destinataire
        });
      });
    }
    return formattedTransactions;
  }

  getRecentTransactions() {
    return [
      {id: '7652b9e5a8f302d…', date: '22/04/2019', type: 'Virement', nature: 'Marcus Dooling',
        montant: '+200 DHTG', portefeuille: 'Portefeuille courant'},
      {id: '56c6dbd7de04d5…', date: '22/04/2019', type: 'Paiement', nature: 'Oleta Ulrich',
        montant: '-30 DHTG', portefeuille: 'Portefeuille courant'},
      {id: '38e0e2e4d01a4d…', date: '20/04/2019', type: 'Virement', nature: 'Geoffrey Berrios',
        montant: '-57 DHTG', portefeuille: 'Portefeuille courant'},
      {id: '68684c19d399rb…', date: '19/04/2019', type: 'Dépôt', nature: 'N/A',
        montant: '+450 DHTG', portefeuille: 'Réserve'},
      {id: '3afcca8a1ac07af…', date: '19/04/2019', type: 'Virement', nature: 'Evan Natoli',
        montant: '+675 DHTG', portefeuille: 'Portefeuille courant'},
      {id: 'fe78e4623tfb4b6…', date: '18/04/2019', type: 'Retrait', nature: 'N/A',
        montant: '-100 DHTG', portefeuille: 'Réserve'},
      {id: '0d6c5855d2088f…', date: '15/04/2019', type: 'Virement', nature: 'Margaret Bui',
        montant: '+45 DHTG', portefeuille: 'Portefeuille courant'},
    ];
  }

  getTransactionsforWalletWithDate(wallet, startDate, endDate) {
    return [
      {id: '7652b9e5a8f302d…', date: '22/04/2019', type: 'Virement', nature: 'Marcus Dooling',
        montant: '+200 DHTG', portefeuille: wallet},
      {id: '56c6dbd7de04d5…', date: '22/04/2019', type: 'Paiement', nature: 'Oleta Ulrich',
        montant: '-30 DHTG', portefeuille: wallet},
      {id: '38e0e2e4d01a4d…', date: '20/04/2019', type: 'Virement', nature: 'Geoffrey Berrios',
        montant: '-57 DHTG', portefeuille: wallet},
      {id: '68684c19d399rb…', date: '19/04/2019', type: 'Dépôt', nature: 'N/A',
        montant: '+450 DHTG', portefeuille: wallet},
      {id: '3afcca8a1ac07af…', date: '19/04/2019', type: 'Virement', nature: 'Evan Natoli',
        montant: '+675 DHTG', portefeuille: wallet},
      {id: 'fe78e4623tfb4b6…', date: '18/04/2019', type: 'Retrait', nature: 'N/A',
        montant: '-100 DHTG', portefeuille: wallet},
      {id: '0d6c5855d2088f…', date: '15/04/2019', type: 'Virement', nature: 'Margaret Bui',
        montant: '+45 DHTG', portefeuille: wallet},
      {id: '68558a976f9a48…', date: '13/04/2019', type: 'Virement', nature: 'Evan Natoli',
        montant: '+125 DHTG', portefeuille: wallet},
    ];
  }

  getTransfersforWalletWithDate(wallet, startDate, endDate) {
    return [
      {id: '7652b9e5a8f302d…', date: '22/04/2019', type: 'Virement', nature: 'Marcus Dooling',
        montant: '+200 DHTG', portefeuille: wallet},
      {id: '56c6dbd7de04d5…', date: '22/04/2019', type: 'Virement', nature: 'Oleta Ulrich',
        montant: '-30 DHTG', portefeuille: wallet},
      {id: '38e0e2e4d01a4d…', date: '20/04/2019', type: 'Virement', nature: 'Geoffrey Berrios',
        montant: '-57 DHTG', portefeuille: wallet},
      {id: '68684c19d399rb…', date: '19/04/2019', type: 'Virement', nature: 'N/A',
        montant: '+450 DHTG', portefeuille: wallet},
      {id: '3afcca8a1ac07af…', date: '19/04/2019', type: 'Virement', nature: 'Evan Natoli',
        montant: '+675 DHTG', portefeuille: wallet},
      {id: 'fe78e4623tfb4b6…', date: '18/04/2019', type: 'Virement', nature: 'N/A',
        montant: '-100 DHTG', portefeuille: wallet},
      {id: '0d6c5855d2088f…', date: '15/04/2019', type: 'Virement', nature: 'Margaret Bui',
        montant: '+45 DHTG', portefeuille: wallet},
      {id: '68558a976f9a48…', date: '13/04/2019', type: 'Virement', nature: 'Evan Natoli',
        montant: '+125 DHTG', portefeuille: wallet},
    ];
  }

  getUserContacts() {
    return [
      {id: 3, libelle: 'Marcus Dooling', ajout: '14/01/2019'},
      {id: 4, libelle: 'Oleta Ulrich', ajout: '16/02/2019'},
    ];
  }

}
