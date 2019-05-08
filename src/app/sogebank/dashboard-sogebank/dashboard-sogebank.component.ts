import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
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

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Tableau de bord - Sogebank');

    this.displayedColumns = ['id', 'date', 'type', 'nature', 'montant', 'portefeuille', 'recu'];
    this.dataSource = [
      {id: '7652b9e5a8f302d…', date: '22/04/2019', type: 'Virement', nature: 'Marcus Dooling',
        montant: '+200 DHTG', portefeuille: 'Portefeuille courant'},
      {id: '56c6dbd7de04d5…', date: '22/04/2019', type: 'Paiement', nature: 'Oleta Ulrich',
        montant: '-30 DHTG', portefeuille: 'Portefeuille courant'},
      {id: '38e0e2e4d01a4d…', date: '20/04/2019', type: 'Virement', nature: 'Geoffrey Berrios',
        montant: '-57 DHTG', portefeuille: 'Portefeuille courant'},
      {id: '68684c19d399rb…', date: '19/04/2019', type: 'Dépôt', nature: 'N/A',
        montant: '+450 DHTG', portefeuille: 'Réserve'},
      {id: '3afcca8a1ac07af…', date: '19/04/2019', type: 'Virement', nature: 'Evan Natoli',
        montant: '+675 DHTG', portefeuille: 'Portefeuille courant'},
      {id: 'fe78e4623tfb4b6…', date: '18/04/2019', type: 'Retrait', nature: 'N/A',
        montant: '-100 DHTG', portefeuille: 'Réserve'},
      {id: '0d6c5855d2088f…', date: '15/04/2019', type: 'Virement', nature: 'Margaret Bui',
        montant: '+45 DHTG', portefeuille: 'Portefeuille courant'},
    ];
  }

}


