import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { IconDefinition, faChartLine, faWallet, faCreditCard, faExchangeAlt, faClipboardList } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-espace-utilisateur-particulier',
  templateUrl: './espace-utilisateur-particulier.component.html',
  styleUrls: ['./espace-utilisateur-particulier.component.css']
})
export class EspaceUtilisateurParticulierComponent implements OnInit {

  breadcrumbIcon: IconDefinition;
  breadcrumbTitle = '';
  breadcrumbDetails = '';

  constructor(
    public router: Router,
   // private sogebankService: SogebankService,
    private titleService: Title
  ) { }


  ngOnInit() {
    this.setBreadcrumbContent();
  }

  setBreadcrumbContent() {
    if (this.router.url === '/sogebank/Particulier/acceuil') {
      this.breadcrumbIcon = faChartLine;
      this.breadcrumbTitle = 'Tableau de bord';
      this.breadcrumbDetails = '(tous portefeuilles confondus)';
    } else if (this.router.url === '/sogebank/Particulier/cartes-particulier') {
      this.breadcrumbIcon = faCreditCard;
      this.breadcrumbTitle = 'Mes cartes';
      this.breadcrumbDetails = '';
    } else if (this.router.url === '/sogebank/Particulier/virements-particulier') {
      this.breadcrumbIcon = faExchangeAlt;
      this.breadcrumbTitle = 'Virements';
      this.breadcrumbDetails = '';
    } else if (this.router.url === '/sogebank/Particulier/releves-particulier') {
      this.breadcrumbIcon = faClipboardList;
      this.breadcrumbTitle = 'Mes relevés';
      this.breadcrumbDetails = '';
    }else if (this.router.url === '/sogebank/Particulier/inscription-particulier') {
      this.breadcrumbIcon = faClipboardList;
      this.breadcrumbTitle = 'Validation incsription';
      this.breadcrumbDetails = '';
    }
  }

}



  