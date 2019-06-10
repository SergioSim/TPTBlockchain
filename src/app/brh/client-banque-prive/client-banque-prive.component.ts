import { Component, OnInit, Input } from '@angular/core';
import { BanqueClient, Portefeuille } from '../clients-banque-prive/clients-banque-prive.component';
import { MatTableDataSource } from '@angular/material';
import { NodeapiService, Transaction } from 'src/app/nodeapi.service';

@Component({
  selector: 'app-client-banque-prive',
  templateUrl: './client-banque-prive.component.html',
  styleUrls: ['./client-banque-prive.component.css']
})
export class ClientBanquePriveComponent implements OnInit {

  @Input() selectedClient: BanqueClient;
  displayedColumns = ['Id', 'ClePub', 'Libelle', 'Ouverture'];
  displayedColumnsTransactions = ['Date', 'Nature', 'Expediteur', 'Destinataire', 'Montant'];
  showTransactions = false;
  public selectedPortefeuille: Portefeuille;
  public transactions: Transaction[] = [];
  public selectedTransaction: Transaction;

  constructor(private apiService: NodeapiService) { }

  ngOnInit() {
    console.log('Initialize');
    console.log(this.selectedClient);
  }

  onRowClicked(row: Portefeuille) {
    console.log('Row clicked: ', row);
    this.selectedPortefeuille = row;
    this.apiService.getTransactions(row.ClePub).subscribe(
      sub => sub.subscribe( res => {
          console.log(res);
          this.showTransactions = true;
          this.transactions = res;
        }, err => {
          console.log(err);
          this.showTransactions = false;
      }));
  }

  onTransactionRowClicked(row: Transaction) {
    this.selectedTransaction = row;
  }

}
