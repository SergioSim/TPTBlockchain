import { Component, OnInit } from '@angular/core';
import { SogebankService } from 'src/app/sogebank/sogebank.service';


@Component({
  selector: 'app-releve-brh',
  templateUrl: './releve-brh.component.html',
  styleUrls: ['./releve-brh.component.css']
})
export class ReleveBrhComponent implements OnInit {
  dataSource: any[];
  selectedPortefeuille = {};
  portefeuilles: any[];

  constructor(
    public sogebankService: SogebankService,
  ) { }

  ngOnInit() {
    this.portefeuilles = this.sogebankService.getUserWallets();
  }

  changePortefeuille(portefeuille) {
    this.dataSource = this.sogebankService.getTransactionsforWalletWithDate(portefeuille.value.libelle, null, null);
  }
}
