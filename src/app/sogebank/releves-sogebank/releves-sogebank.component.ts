import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { DateAdapter } from '@angular/material';
import { faPrint, faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-releves-sogebank',
  templateUrl: './releves-sogebank.component.html',
  styleUrls: ['./releves-sogebank.component.css']
})
export class RelevesSogebankComponent implements OnInit {
  dataSource: any[];
  selectedPortefeuille = {};
  portefeuilles: any[];
  faPrint = faPrint;
  faDownload = faDownload;

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private titleService: Title,
    private adapter: DateAdapter<any>
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Relevés - Sogebank');
    this.adapter.setLocale('fr');

    this.portefeuilles = this.sogebankService.getUserWallets();
  }

  changePortefeuille(portefeuille) {
    this.dataSource = this.sogebankService.getTransactionsforWalletWithDate(portefeuille.value.libelle, null, null);
  }
}
