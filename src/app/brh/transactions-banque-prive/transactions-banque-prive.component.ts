import { Component, OnInit } from '@angular/core';
import { NodeapiService, Transaction } from 'src/app/nodeapi.service';
import { Portefeuille } from '../clients-banque-prive/clients-banque-prive.component';
import { MatSnackBar } from '@angular/material';
import { DebitCredit, CommonUtilsService } from 'src/app/common/common-utils.service';

@Component({
  selector: 'app-transactions-banque-prive',
  templateUrl: './transactions-banque-prive.component.html',
  styleUrls: ['./transactions-banque-prive.component.css']
})
export class TransactionsBanquePriveComponent implements OnInit {

  displayedColumns = ['Id', 'ClePub', 'Libelle', 'Ouverture'];
  displayedColumnsTransactions = ['Date', 'Nature', 'Expediteur', 'Destinataire', 'Montant'];
  public selectedPortefeuille: Portefeuille;
  public showTransactions = false;
  public transactions: Transaction[] = [];
  public selectedTransaction: Transaction;
  public selectedSolde = 0;
  public selectedDebit = 0;
  public selectedCredit = 0;

  constructor(
    public apiService: NodeapiService,
    private util: CommonUtilsService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  onRowClicked(row: Portefeuille) {
    console.log('Row clicked: ', row);
    this.selectedPortefeuille = row;
    this.apiService.getTransactions(row.ClePub).subscribe(
      sub => sub.subscribe( res => {
          if (res.length === 0) {
            this.snackBar.open('Portefeuille n\'a pas encore des transactions!', 'Fermer', {
              duration: 5000,
              panelClass: ['alert-snackbar']
            });
          }
          this.showTransactions = true;
          this.transactions = res;
          setTimeout(() => {
            // sorry I'm too lazy ...
            const debitCredit: DebitCredit = this.util.getDebitCredit(res);
            this.selectedCredit = debitCredit.credit;
            this.selectedDebit = debitCredit.debit;
          }, 1000);
          console.log('scrolling..');
          setTimeout(() => {
            const elmnt = document.querySelector('.contentTransactions');
            elmnt.scrollIntoView({behavior: 'smooth'});
          }, 100);
        }, err => {
          console.log(err);
          this.showTransactions = false;
      }));
    this.apiService.getRecord(row.ClePub).subscribe(data => {
      this.selectedSolde = data[0].balance;
    });
  }

  onTransactionRowClicked(row: Transaction) {
    this.selectedTransaction = row;
    console.log(row);
  }

}
