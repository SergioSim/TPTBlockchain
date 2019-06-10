import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { DateAdapter } from '@angular/material';
import { NodeapiService } from 'src/app/nodeapi.service';

@Component({
  selector: 'app-suivi-virements-sogebank',
  templateUrl: './suivi-virements-sogebank.component.html',
  styleUrls: ['./suivi-virements-sogebank.component.css']
})
export class SuiviVirementsSogebankComponent implements OnInit {
  dataSource: any[];
  selectedPortefeuille = {};
  portefeuilles: any[];
  startDate: Date;
  endDate: Date;

  constructor(
    private apiService: NodeapiService,
    public sogebankService: SogebankService,
    private titleService: Title,
    private adapter: DateAdapter<any>
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Suivi virements - Sogebank');
    this.adapter.setLocale('fr');
  }

  initData() {
    this.portefeuilles = this.apiService.portefeuilles;
  }

  changePortefeuille() {
    if (this.startDate && this.endDate && this.selectedPortefeuille) {
      this.dataSource = this.sogebankService.formatTransfersforWalletWithDate(
        this.selectedPortefeuille, this.startDate, this.endDate);
    }
  }

  startDateChange(event) {
    if (event.value instanceof Date) {
      this.startDate = event.value;
      this.changePortefeuille();
    }
  }

  endDateChange(event) {
    if (event.value instanceof Date) {
      this.endDate = event.value;
      this.changePortefeuille();
    }
  }

}


