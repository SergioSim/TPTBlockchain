import { Component, OnInit } from '@angular/core';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { NodeapiService } from 'src/app/nodeapi.service';
import { CommonUtilsService } from 'src/app/common/common-utils.service';
import { Portefeuille } from '../clients-banque-prive/clients-banque-prive.component';

@Component({
  selector: 'app-portefeuille-banque-prive',
  templateUrl: './portefeuille-banque-prive.component.html',
  styleUrls: ['./portefeuille-banque-prive.component.css']
})
export class PortefeuilleBanquePriveComponent implements OnInit {

  public selectedPortefeuille: Portefeuille;
  faPen = faPen;
  public selectedSolde = 0;

  constructor(public apiService: NodeapiService, public commonUtilsService: CommonUtilsService) { }

  ngOnInit() {
    this.selectedPortefeuille = this.apiService.portefeuilles[0];
    this.apiService.getRecord(this.selectedPortefeuille.ClePub).subscribe(data => {
      this.selectedSolde = data[0].balance;
    });
  }

  openEditWalletDialog() {
    console.log('TODO implementation');
  }

}
