import { Component, OnInit, ViewChild } from '@angular/core';
import { apiUrl, NodeapiService } from 'src/app/nodeapi.service';
import { Banque } from 'src/app/banque.modele';
import { forEach } from '@angular/router/src/utils/collection';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-habilitation-brh',
  templateUrl: './habilitation-brh.component.html',
  styleUrls: ['./habilitation-brh.component.css']
})
export class HabilitationBrhComponent implements OnInit {
  data: MatTableDataSource<Banque>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  listBanqueValid: any[];
  displayedColumns: any[];
  taille: number;

  constructor(
    private service: NodeapiService,
  ) { }


  ngOnInit() {
    this.refreshListBanqueValid();
    this.displayedColumns = ['Nom', 'Email', 'Telephone', 'Portefeuille', 'Statut'];
    this.taille = 23;
  }
  refreshListBanqueValid() {
    this.service.makeRequest(apiUrl.allBanksValid, {}).
      subscribe(res => {
        this.listBanqueValid = res as Banque[];
        this.data = new MatTableDataSource(this.listBanqueValid);
        this.data.paginator = this.paginator;
      }
      );

  }
}

