import { Injectable } from '@angular/core';

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

}
