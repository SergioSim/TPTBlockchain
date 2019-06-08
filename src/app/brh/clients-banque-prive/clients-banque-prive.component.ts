import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';
import { MatSnackBar, MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients-banque-prive',
  templateUrl: './clients-banque-prive.component.html',
  styleUrls: ['./clients-banque-prive.component.css']
})
export class ClientsBanquePriveComponent implements OnInit {

  dataSource: MatTableDataSource<BanqueClient>;
  displayedColumns = ['Email', 'Nom', 'Prenom', 'Status'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() selectedClient = new EventEmitter<BanqueClient>();

  public roles: any[] = ['Public', 'DemandeParticulier', 'DemandeCommercant', 'Particulier', 'Commercant', 'Banque', 'Admin'];
  constructor(
    private router: Router,
    private apiService: NodeapiService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.apiService.makeRequest(apiUrl.clients, {banque: this.apiService.banque}).subscribe(
      res => {
        const result = res as BanqueClient[];
        console.log(result);
        for (const i of res) {
          i.Status = this.roles[i.Role_Id];
        }
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, err => {
        console.log('err : ');
        console.log(err);
        if (err.status === 403) {
          this.apiService.logout();
          this.router.navigate(['/brh/accueil']);
          this.snackBar.open('Votre session a expire!', 'Fermer', {
            duration: 5000,
            panelClass: ['alert-snackbar']
          });
        }
      }
    );
  }

  onRowClicked(row: BanqueClient) {
    console.log('Row clicked: ', row);
    this.selectedClient.emit(row);
  }

  applyFilter(filterValue: string, itype: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filterPredicate = (data: BanqueClient, filter: string) => {
      if (itype === 'Status') { return data[itype].toLowerCase() === filter; }
      return data[itype].toLowerCase().indexOf(filter) !== -1;
    };
    this.dataSource.filter = filterValue;
  }

}

export interface BanqueClient {
  Email: string;
  Nom: string;
  Prenom: string;
  Adresse: string;
  Ville: string;
  Code_Postal: string;
  Civilite: string;
  Profession: string;
  Siret: string;
  Situation_Familiale: string;
  Tel: string;
  Status: string;
  Portefeuille: Portefeuille[];
}

export interface Portefeuille {
  Id: string;
  Libelle: string;
  ClePub: string;
  Ouverture: string;
}
