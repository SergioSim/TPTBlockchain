import { Component, OnInit } from '@angular/core';
import { apiUrl, NodeapiService } from 'src/app/nodeapi.service';
import { Banque } from 'src/app/banque.modele';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-habilitation-brh',
  templateUrl: './habilitation-brh.component.html',
  styleUrls: ['./habilitation-brh.component.css']
})
export class HabilitationBrhComponent implements OnInit {

  listBanqueValid : any [];
  displayedColumns : any[];
  taille:number;

  constructor(
    private service :NodeapiService,
  ) { }


  ngOnInit() {
    this.refreshListBanqueValid();
    this.displayedColumns = ['Nom','Email','Telephone','Portefeuille','Statut'];
    this.taille=23;
  }
  refreshListBanqueValid(){
    this.service.makeRequest(apiUrl.allBanksValid, {}).toPromise().then(res=>this.listBanqueValid = res as Banque[] );
  }
}
