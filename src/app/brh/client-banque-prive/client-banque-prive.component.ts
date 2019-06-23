import { Component, OnInit, Input } from '@angular/core';
import { BanqueClient, Portefeuille } from '../clients-banque-prive/clients-banque-prive.component';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { NodeapiService, Transaction } from 'src/app/nodeapi.service';
import { CommonUtilsService, DebitCredit } from 'src/app/common/common-utils.service';

@Component({
  selector: 'app-client-banque-prive',
  templateUrl: './client-banque-prive.component.html',
  styleUrls: ['./client-banque-prive.component.css']
})
export class ClientBanquePriveComponent implements OnInit {

  @Input()
  set setSelectedClient(client: BanqueClient) {
    this.selectedClient = client;
    this.showTransactions = false;
    const elmnt = document.querySelector('.content');
    elmnt.scrollIntoView({behavior: 'smooth'});
  }

  displayedColumns = ['Id', 'ClePub', 'Libelle', 'Ouverture'];
  displayedColumnsTransactions = ['Date', 'Nature', 'Expediteur', 'Destinataire', 'Montant'];
  showTransactions = false;
  public selectedClient: BanqueClient;
  public selectedPortefeuille: Portefeuille;
  public transactions: Transaction[] = [];
  public selectedTransaction: Transaction;
  public selectedSolde = 0;
  public selectedDebit = 0;
  public selectedCredit = 0;

  constructor(
    private apiService: NodeapiService,
    private util: CommonUtilsService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log('Initialize');
    console.log(this.selectedClient);
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
  }

}
