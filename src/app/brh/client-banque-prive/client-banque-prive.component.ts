import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BanqueClient, Portefeuille } from '../clients-banque-prive/clients-banque-prive.component';
import { MatTableDataSource, MatSnackBar, MatDialog, MatPaginator, MatSort, DateAdapter } from '@angular/material';
import { NodeapiService, Transaction, apiUrl } from 'src/app/nodeapi.service';
import { CommonUtilsService, DebitCredit } from 'src/app/common/common-utils.service';
import { InfoPersonelBanquePriveComponent } from '../info-personel-banque-prive/info-personel-banque-prive.component';
import { Card } from 'src/app/common/common-carte/common-carte.component';

@Component({
  selector: 'app-client-banque-prive',
  templateUrl: './client-banque-prive.component.html',
  styleUrls: ['./client-banque-prive.component.css']
})
export class ClientBanquePriveComponent implements OnInit {

  @Input()
  set setSelectedClient(client: BanqueClient) {
    this.selectedClient = client;
    this.selectedClientPortefeuilles = new MatTableDataSource(client.Portefeuille as Portefeuille[]);
    this.selectedClientPortefeuilles.paginator = this.paginatorClient;
    this.selectedClientPortefeuilles.sort = this.sortClient;
    this.showTransactions = false;
    this.showCartes = false;
    this.getClientCards();
    const elmnt = document.querySelector('.content');
    elmnt.scrollIntoView({behavior: 'smooth'});
  }

  displayedColumns = ['Id', 'ClePub', 'Libelle', 'Ouverture'];
  displayedColumnsTransactions = ['Date', 'Nature', 'Expediteur', 'Destinataire', 'Montant'];
  public showTransactions = false;
  public showCartes = false;
  public selectedClient: BanqueClient;
  public selectedClientPortefeuilles: MatTableDataSource<Portefeuille>;
  public selectedPortefeuille: Portefeuille;
  public transactions: MatTableDataSource<Transaction>;
  public selectedTransaction: Transaction;
  public selectedSolde = 0;
  public selectedDebit = 0;
  public selectedCredit = 0;
  public types = ['Virement', 'Recu'];
  public startDate: number = null;
  public endDate: number = null;
  public cartes: Card[];
  @ViewChild(MatPaginator) paginatorClient: MatPaginator;
  @ViewChild(MatPaginator) paginatorTransaction: MatPaginator;
  @ViewChild(MatSort) sortClient: MatSort;
  @ViewChild(MatSort) sortTransaction: MatSort;

  constructor(
    private apiService: NodeapiService,
    private util: CommonUtilsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private adapter: DateAdapter<any>) { }

  ngOnInit() {
    console.log('Initialize');
    console.log(this.selectedClient);
    this.adapter.setLocale('fr');
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
          this.transactions = new MatTableDataSource(res as Transaction[]);
          setTimeout(() => {
            // sorry I'm too lazy ...
            const debitCredit: DebitCredit = this.util.getDebitCredit(res);
            this.selectedCredit = debitCredit.credit;
            this.selectedDebit = debitCredit.debit;
            this.transactions.paginator = this.paginatorTransaction;
            this.transactions.sort = this.sortTransaction;
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

  getClientCards() {
    const portefeuilleIds = this.selectedClient.Portefeuille.map(pf => pf.Id);
    this.apiService.makeRequest(apiUrl.cardsByPortefeuilleIds, {Ids: portefeuilleIds}).subscribe(
      finalRes => {
        console.log('Cartes', finalRes);
        this.cartes = finalRes;
        this.cartes.forEach(carte => {
          const attached = this.selectedClient.Portefeuille.filter(portefeuille => portefeuille.Id = carte.Portefeuille_Id);
          carte.rattachement = attached[0].Libelle + ' [' + attached[0].ClePub + ']';
        });
        console.log('this.cartes', this.cartes);
        this.showCartes = true;
    }, error => {
      this.showCartes = false;
      this.snackBar.open('Impossible de recuperer les cartes du client!', 'Fermer', {
        duration: 5000,
        panelClass: ['alert-snackbar']
      });
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

  onTransactionRowClicked(row: Transaction) {
    this.selectedTransaction = row;
  }

  updateStatus(name: string, clientChamp: string, selectedClient: BanqueClient) {
    console.log(selectedClient);
    this.dialog.open(InfoPersonelBanquePriveComponent, {
      width: '250px',
      data: {name, clientChamp, client: selectedClient}
    });
  }
}