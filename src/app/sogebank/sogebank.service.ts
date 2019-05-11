import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SogebankService {
  displayLoginForm = true;

  constructor() { }

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

  getUserWallets() {
    return [
      {id: 1, libelle: 'Portefeuille courant', solde: '12 386 DHTG', ouverture: '14/01/2019', activite: '+1 189 DHTG'},
      {id: 2, libelle: 'Réserve', solde: '2 250 DHTG', ouverture: '28/02/2019', activite: '+250 DHTG'},
    ];
  }

  getUserCards() {
    return [
      {id: 1, libelle: 'Carte commerce', creation: '14/01/2019', activite: '+0 DHTG', rattachement: 'Portefeuille courant'},
      {id: 2, libelle: 'Carte déplacements', creation: '20/01/2019', activite: '-30 DHTG', rattachement: 'Portefeuille courant'},
      {id: 3, libelle: 'Carte réserve', creation: '28/02/2019', activite: '-100 DHTG', rattachement: 'Réserve'},
    ];
  }

}
