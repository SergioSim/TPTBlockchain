import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { DateAdapter } from '@angular/material';
import { faPrint, faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-suivi-virements-sogebank',
  templateUrl: './suivi-virements-sogebank.component.html',
  styleUrls: ['./suivi-virements-sogebank.component.css']
})
export class SuiviVirementsSogebankComponent implements OnInit {
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
    this.titleService.setTitle('Suivi virements - Sogebank');
    this.adapter.setLocale('fr');

    this.portefeuilles = this.sogebankService.getUserWallets();
  }

  changePortefeuille(portefeuille) {
    this.dataSource = this.sogebankService.getTransfersforWalletWithDate(portefeuille.value.libelle, null, null);
  }

}


