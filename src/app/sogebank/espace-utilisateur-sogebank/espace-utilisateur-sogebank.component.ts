import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { IconDefinition, faChartLine, faWallet, faCreditCard, faExchangeAlt,
  faClipboardList, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { NodeapiService } from 'src/app/nodeapi.service';
import { CommonUtilsService } from 'src/app/common/common-utils.service';
import { Role } from '../Role';

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
    private apiService: NodeapiService,
    private sogebankService: SogebankService,
    private commonUtilsService: CommonUtilsService,
  ) { }

  ngOnInit() {
    if (this.apiService.email === '' || this.apiService.email === undefined) {
      this.router.navigate(['/sogebank/login']);
    } else if (this.apiService.permission === Role.DEMANDECOMMERCANT ||
      this.apiService.permission === Role.DEMANDEPARTICULIER) {
      this.router.navigate(['/sogebank/documents']);
    }
    this.setBreadcrumbContent();

    if (this.apiService.portefeuilles && this.apiService.portefeuilles.length > 0) {
      for (const portefeuille of this.apiService.portefeuilles) {
        this.apiService.getRecord(portefeuille.ClePub).subscribe(
          data => {
            if (data[0] && data[0].balance) {
              portefeuille.Solde = this.commonUtilsService.numberToCurrencyString(data[0].balance);
            } else {
              portefeuille.Solde = 0;
            }
          },
          error => {
            console.log(error);
          });
      }
    }
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
    } else if (this.router.url === '/sogebank/virements' || this.router.url === '/sogebank/virements/suivi') {
      this.breadcrumbIcon = faExchangeAlt;
      this.breadcrumbTitle = 'Virements';
      this.breadcrumbDetails = '';
    } else if (this.router.url === '/sogebank/releves') {
      this.breadcrumbIcon = faClipboardList;
      this.breadcrumbTitle = 'Mes relevés';
      this.breadcrumbDetails = '';
    } else if (this.router.url === '/sogebank/documents') {
      this.breadcrumbIcon = faFileUpload;
      this.breadcrumbTitle = 'Mes documents';
      this.breadcrumbDetails = '';
    }
  }

}


