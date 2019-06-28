import { Component, OnInit, ViewChild } from '@angular/core';
import { NodeapiService, Transaction } from 'src/app/nodeapi.service';
import { Portefeuille } from '../clients-banque-prive/clients-banque-prive.component';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
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
  public transactions: MatTableDataSource<Transaction>;
  public selectedTransaction: Transaction;
  public selectedSolde = 0;
  public selectedDebit = 0;
  public selectedCredit = 0;
  public types = ['Virement', 'Recu'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public apiService: NodeapiService,
    private util: CommonUtilsService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.apiService.getTransactions(this.apiService.portefeuilles[0].ClePub).subscribe(
      sub => sub.subscribe( res => {
          if (res.length === 0) {
            this.snackBar.open('Portefeuille n\'a pas encore des transactions!', 'Fermer', {
              duration: 5000,
              panelClass: ['alert-snackbar']
            });
          }
          this.showTransactions = true;
          this.transactions = new MatTableDataSource(res as Transaction[]);
          setTimeout(() => {
            // sorry I'm too lazy ...
            const debitCredit: DebitCredit = this.util.getDebitCredit(res);
            this.selectedCredit = debitCredit.credit;
            this.selectedDebit = debitCredit.debit;
            this.transactions.paginator = this.paginator;
            this.transactions.sort = this.sort;
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
    this.apiService.getRecord(this.apiService.portefeuilles[0].ClePub).subscribe(data => {
      this.selectedSolde = data[0].balance;
    });
  }

  applyFilter(filterValue: string, itype: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.transactions.filterPredicate = (data: Transaction, filter: string) => {
      if (itype === 'Type') { return data[itype].toLowerCase() === filter; }
      return data[itype].toLowerCase().indexOf(filter) !== -1;
    };
    this.transactions.filter = filterValue;
  }

  onRowClicked(row: Portefeuille) {
    console.log('Row clicked: ', row);
    this.selectedPortefeuille = row;
  }

  onTransactionRowClicked(row: Transaction) {
    this.selectedTransaction = row;
    console.log(row);
  }

}
