import { Component, OnInit, Input } from '@angular/core';
import { BanqueClient, Portefeuille } from '../clients-banque-prive/clients-banque-prive.component';
import { MatTableDataSource } from '@angular/material';
import { NodeapiService } from 'src/app/nodeapi.service';

@Component({
  selector: 'app-client-banque-prive',
  templateUrl: './client-banque-prive.component.html',
  styleUrls: ['./client-banque-prive.component.css']
})
export class ClientBanquePriveComponent implements OnInit {

  @Input() selectedClient: BanqueClient;
  displayedColumns = ['Id', 'ClePub', 'Libelle', 'Ouverture'];
  showTransactions = false;

  constructor(private apiService: NodeapiService) { }

  ngOnInit() {
    console.log('Initialize');
    console.log(this.selectedClient);
  }

  onRowClicked(row: Portefeuille) {
    console.log('Row clicked: ', row);
    this.showTransactions = true;
    this.apiService.getTransactions(row.ClePub).subscribe(
      sub => sub.subscribe( res => {
          console.log(res);
        }, err => {
          console.log(err);
      }));
  }

}
