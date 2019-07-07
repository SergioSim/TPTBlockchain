import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NodeapiService, apiUrl, StatusClient, Roles } from 'src/app/nodeapi.service';
import { MatSnackBar, MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients-banque-prive',
  templateUrl: './clients-banque-prive.component.html',
  styleUrls: ['./clients-banque-prive.component.css']
})
export class ClientsBanquePriveComponent implements OnInit {

  dataSource: MatTableDataSource<BanqueClient>;
  displayedColumns = ['Email', 'Nom', 'Prenom', 'Role', 'Status'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() selectedClient = new EventEmitter<BanqueClient>();
  public selectedBanqueClient: BanqueClient;

  public roles: string[];
  public statuses: string[];

  constructor(
    private router: Router,
    private apiService: NodeapiService,
    private snackBar: MatSnackBar) {
      this.roles = Roles;
      this.statuses = StatusClient;
     }

  ngOnInit() {
    this.apiService.makeRequest(apiUrl.clients, {banque: this.apiService.banque}).subscribe(
      res => {
        for (const i of res) {
          i.StatusClient =  StatusClient[i.Status];
          i.Status = this.roles[i.Role_Id];
          i.LoginAttempts = i.LoginAttempts ? i.LoginAttempts : 0;
          i.Attempt1 = i.Attempt1 ? Date.parse(i.Attempt1) : null;
          i.Attempt2 = i.Attempt2 ? Date.parse(i.Attempt2) : null;
          i.Attempt3 = i.Attempt3 ? Date.parse(i.Attempt3) : null;
        }
        this.apiService.bankClients = res;
        this.dataSource = new MatTableDataSource(res);
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
    this.selectedBanqueClient = row;
    this.selectedClient.emit(row);
  }

  applyFilter(filterValue: string, itype: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filterPredicate = (data: BanqueClient, filter: string) => {
      if (itype === 'Status' || itype === 'StatusClient') { return data[itype].toLowerCase() === filter; }
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
  StatusClient: string;
  Portefeuille: Portefeuille[];
  LoginAttempts: number;
  Attempt1: Date;
  Attempt2: Date;
  Attempt3: Date;
}

export interface Portefeuille {
  Id: string;
  Libelle: string;
  ClePub: string;
  Ouverture: string;
}
