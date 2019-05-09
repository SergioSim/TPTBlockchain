import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { IconDefinition, faChartLine, faWallet, faCreditCard, faExchangeAlt, faClipboardList } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-espace-utilisateur-sogebank',
  templateUrl: './espace-utilisateur-sogebank.component.html',
  styleUrls: ['./espace-utilisateur-sogebank.component.css']
})
export class EspaceUtilisateurSogebankComponent implements OnInit {
  breadcrumbIcon: IconDefinition;
  breadcrumbTitle = '';
  breadcrumbDetails = '';

  constructor(
    public router: Router,
    private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.setBreadcrumbContent();
  }

  setBreadcrumbContent() {
    if (this.router.url === '/sogebank/dashboard') {
      this.breadcrumbIcon = faChartLine;
      this.breadcrumbTitle = 'Tableau de bord';
      this.breadcrumbDetails = '(tous portefeuilles confondus)';
    } else if (this.router.url === '/sogebank/portefeuilles') {
      this.breadcrumbIcon = faWallet;
      this.breadcrumbTitle = 'Mes portefeuilles';
      this.breadcrumbDetails = '';
    } else if (this.router.url === '/sogebank/cartes') {
      this.breadcrumbIcon = faCreditCard;
      this.breadcrumbTitle = 'Mes cartes';
      this.breadcrumbDetails = '';
    } else if (this.router.url === '/sogebank/virements') {
      this.breadcrumbIcon = faExchangeAlt;
      this.breadcrumbTitle = 'Virements';
      this.breadcrumbDetails = '';
    } else if (this.router.url === '/sogebank/releves') {
      this.breadcrumbIcon = faClipboardList;
      this.breadcrumbTitle = 'Mes relevés';
      this.breadcrumbDetails = '';
    }
  }

}


