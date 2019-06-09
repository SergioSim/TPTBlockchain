import { Component, OnInit, Input } from '@angular/core';
import { BanqueClient, Portefeuille } from '../clients-banque-prive/clients-banque-prive.component';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-client-banque-prive',
  templateUrl: './client-banque-prive.component.html',
  styleUrls: ['./client-banque-prive.component.css']
})
export class ClientBanquePriveComponent implements OnInit {

  @Input() selectedClient: BanqueClient;
  displayedColumns = ['Id', 'ClePub', 'Libelle', 'Ouverture'];

  constructor() { }

  ngOnInit() {
    console.log('Initialize');
    console.log(this.selectedClient);
  }

}
