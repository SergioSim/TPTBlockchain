import { Injectable } from '@angular/core';
import { Transaction } from '../nodeapi.service';

@Injectable({
  providedIn: 'root',
})
export class CommonUtilsService {

  constructor() { }

  numberToCurrencyString(amount: number) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' DHTG';
  }

  currencyStringtoNumber(str: string) {
    return Number(str.substring(0, str.length - 5).replace(' ', ''));
  }

  formatDate(date) {
    const dateParts = date.split('-');
    const convertedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
    return ('0' + (convertedDate.getDate() + 1)).slice(-2)  + '/'
      + ('0' + (convertedDate.getMonth() + 1)).slice(-2) + '/' + convertedDate.getFullYear();
  }

  getDebitCredit(transactions: Transaction[]) {
    const debitCredit: DebitCredit = {credit: 0, debit: 0};
    transactions.forEach( transaction => {
      if (transaction.Montant < 0) {
        debitCredit.debit += transaction.Montant;
      } else {
        debitCredit.credit += transaction.Montant;
      }
    });
    return debitCredit;
  }

}

export interface DebitCredit {
  credit: number;
  debit: number;
}
