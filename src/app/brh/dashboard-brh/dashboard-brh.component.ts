import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { faDownload, faSyncAlt, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { NodeapiService, apiUrl } from '../../nodeapi.service';
import { Portefeuille } from 'src/app/Portefeuille.modele';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CommonUtilsService } from 'src/app/common/common-utils.service';
@Component({
  selector: 'app-dashboard-brh',
  templateUrl: './dashboard-brh.component.html',
  styleUrls: ['./dashboard-brh.component.css']
})
export class DashboardBrhComponent implements OnInit {
  dataSource: MatTableDataSource<BanqueClient>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[];
  listBanque :  BanqueClient [];
  p:number=1;
  rechercheText;
  
  constructor(
    private service: NodeapiService,
    private commonUtilsService :CommonUtilsService
  ) { }
  
  ngOnInit() {
  //  this.displayedColumns = ['Banque','Email','Tel', 'Nom', 'Prenom', 'numPortefeuille', 'Solde'];
    this.displayedColumns = ['Banque','Email','Tel', 'numPortefeuille', 'Solde'];
    this.getClients();
    console.log(this.dataSource);
  }        

  getClients() {
    this.service.makeRequest(apiUrl.allClientsBanque, {}).subscribe(
      res => {
        this.listBanque = res as BanqueClient[];
        // pour chaque client 
        for (const banque of this.listBanque) {
          for (const portefeuille of banque.Portefeuille) {
                banque.ClePub = portefeuille.ClePub;
                this.service.getRecord(portefeuille.ClePub).subscribe(
                  data => {
                    if (data[0] && data[0].balance) {
                      banque.Solde = this.commonUtilsService.numberToCurrencyString(data[0].balance);
                    }
                  },
                  error => {
                    console.log(error);
                  });
              }
            }
        

        this.dataSource = new MatTableDataSource(this.listBanque);
        this.dataSource.paginator = this.paginator;

      }
    );
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
    Solde : string;
    ClePub :String
  }




