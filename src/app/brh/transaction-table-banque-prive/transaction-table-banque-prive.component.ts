import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NodeapiService, Transaction } from 'src/app/nodeapi.service';
import { Portefeuille } from '../clients-banque-prive/clients-banque-prive.component';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort, DateAdapter } from '@angular/material';
import { DebitCredit, CommonUtilsService } from 'src/app/common/common-utils.service';

@Component({
  selector: 'app-transaction-table-banque-prive',
  templateUrl: './transaction-table-banque-prive.component.html',
  styleUrls: ['./transaction-table-banque-prive.component.css']
})
export class TransactionTableBanquePriveComponent implements OnInit {

  displayedColumns = ['Id', 'ClePub', 'Libelle', 'Ouverture'];
  displayedColumnsTransactions = ['Date', 'Nature', 'Expediteur', 'Destinataire', 'Motif', 'Montant'];
  public selectedPortefeuille: Portefeuille;
  public showTransactions = false;
  public selectedTransaction: Transaction;
  public types = ['Virement', 'Recu'];
  public startDate: number = null;
  public endDate: number = null;
  @Input() transactions: MatTableDataSource<Transaction>;
  @Input() selectedSolde = 0;
  @Input() selectedDebit = 0;
  @Input() selectedCredit = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public apiService: NodeapiService,
    private util: CommonUtilsService,
    private snackBar: MatSnackBar,
    private adapter: DateAdapter<any>) { }

  ngOnInit() {
    this.adapter.setLocale('fr');
    setTimeout(() => {
      this.transactions.paginator = this.paginator;
      this.transactions.sort = this.sort;
      this.transactions.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'Date': {
            return item.Timestamp;
          }
          default: {
            return item[property];
          }
        }
      };
      const elmnt = document.querySelector('.contentTransactions');
      elmnt.scrollIntoView({behavior: 'smooth'});
    }, 1000);
    this.apiService.getRecord(this.apiService.portefeuilles[0].ClePub).subscribe(data => {
      this.selectedSolde = data[0].balance;
    });
  }

  applyFilter(filterValue, itype: string, isStart: boolean = null) {
    this.startDate = isStart ? (filterValue === null ? null : filterValue.getTime() / 1000 ) : this.startDate;
    this.endDate =  isStart === false ? (filterValue === null ? null : filterValue.getTime() / 1000 ) : this.endDate;
    if (isStart === null) {
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    }
    this.transactions.filterPredicate = (data: Transaction, filter: string) => {
      if ((this.startDate !== null && data.Timestamp < this.startDate) ||
          (this.endDate !== null && data.Timestamp > this.endDate)) {
        return false;
      }
      if (itype === 'Timestamp') { return true; }
      if (itype === 'Type') { return data[itype].toLowerCase() === filter; }
      return data[itype].toLowerCase().indexOf(filter) !== -1;
    };
    this.transactions.filter = filterValue == null ? ' ' : filterValue;
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
