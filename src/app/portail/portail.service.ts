import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PortailService {

  constructor() { }

getBRHDetails() {
    return {name: 'brh', image: 'assets/logos/brh_gradient_logo.jpeg', url: '/brh/accueil'};
  }

getBankDetails() {
    return [
      {name: 'sogebank', image: 'assets/logos/sogebank_logo.png', url: '/sogebank/accueil'},
      {name: 'scotiabank', image: 'assets/logos/scotiabank_logo.png', url: 'scotiabank.com'},
      {name: 'capital bank', image: 'assets/logos/capital_bank_logo.jpg', url: 'capital-bank.com'},
      {name: 'buh', image: 'assets/logos/buh_logo.png', url: 'buh.com'},
      {name: 'citibank', image: 'assets/logos/citibank_logo.png', url: 'citibank.com'},
      {name: 'unibank', image: 'assets/logos/unibank_logo.png', url: 'unibank.com'},
      {name: 'bph', image: 'assets/logos/bph_logo.jpeg', url: 'bph.com'},
      {name: 'bnc', image: 'assets/logos/bnc_logo.png', url: 'bnc.com'}
    ];
  }
}