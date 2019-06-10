import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { DateAdapter } from '@angular/material';
import { NodeapiService } from 'src/app/nodeapi.service';

@Component({
  selector: 'app-releves-sogebank',
  templateUrl: './releves-sogebank.component.html',
  styleUrls: ['./releves-sogebank.component.css']
})
export class RelevesSogebankComponent implements OnInit {
  dataSource: any[];
  selectedPortefeuille = {};
  portefeuilles: any[];

  constructor(
    private route: ActivatedRoute,
    private apiService: NodeapiService,
    public sogebankService: SogebankService,
    private titleService: Title,
    private adapter: DateAdapter<any>
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Relevés - Sogebank');
    this.adapter.setLocale('fr');
  }

  initData() {
    this.portefeuilles = this.apiService.portefeuilles;
  }

  changePortefeuille(portefeuille) {
    this.dataSource = this.sogebankService.getTransactionsforWalletWithDate(portefeuille.value.libelle, null, null);
  }
}
