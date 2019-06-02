import { Component, OnInit, ViewChild } from '@angular/core';
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
  displayedColumns = ['Email', 'Nom', 'Prenom'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private apiService: NodeapiService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.apiService.makeRequest(apiUrl.clients, {banque: this.apiService.banque}).subscribe(
      res => {
        const result = res as BanqueClient[];
        console.log(result);
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

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

}

export interface BanqueClient {
  Email: string;
  Nom: string;
  Prenom: string;
}
