import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faDownload, faSyncAlt, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-sogebank',
  templateUrl: './dashboard-sogebank.component.html',
  styleUrls: ['./dashboard-sogebank.component.css']
})
export class DashboardSogebankComponent implements OnInit {
  displayedColumns: string[];
  dataSource: any[];
  faDownload = faDownload;
  faSyncAlt = faSyncAlt;
  faPlusCircle = faPlusCircle;
  faMinusCircle = faMinusCircle;

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Tableau de bord - Sogebank');

    this.displayedColumns = ['id', 'date', 'type', 'nature', 'montant', 'portefeuille', 'recu'];
    this.dataSource = this.sogebankService.getRecentTransactions();
  }

}


