import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { IconDefinition, faChartLine, faWallet, faCreditCard, faExchangeAlt,
  faClipboardList, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { NodeapiService } from 'src/app/nodeapi.service';
import { CommonUtilsService } from 'src/app/common/common-utils.service';
import { Role } from '../Role';
import { DashboardSogebankComponent } from '../dashboard-sogebank/dashboard-sogebank.component';
import { PortefeuillesSogebankComponent } from '../portefeuilles-sogebank/portefeuilles-sogebank.component';
import { CartesSogebankComponent } from '../cartes-sogebank/cartes-sogebank.component';
import { VirementsSogebankComponent } from '../virements-sogebank/virements-sogebank.component';
import { SuiviVirementsSogebankComponent } from '../suivi-virements-sogebank/suivi-virements-sogebank.component';
import { RelevesSogebankComponent } from '../releves-sogebank/releves-sogebank.component';
import { DocumentsSogebankComponent } from '../documents-sogebank/documents-sogebank.component';

@Component({
  selector: 'app-espace-utilisateur-sogebank',
  templateUrl: './espace-utilisateur-sogebank.component.html',
  styleUrls: ['./espace-utilisateur-sogebank.component.css']
})
export class EspaceUtilisateurSogebankComponent implements OnInit {
  breadcrumbIcon: IconDefinition;
  breadcrumbTitle = '';
  breadcrumbDetails = '';
  childComponent: any;

  @ViewChild(DashboardSogebankComponent) dashboardSogebankComponent;
  @ViewChild(PortefeuillesSogebankComponent) portefeuillesSogebankComponent;
  @ViewChild(CartesSogebankComponent) cartesSogebankComponent;
  @ViewChild(VirementsSogebankComponent) virementsSogebankComponent;
  @ViewChild(SuiviVirementsSogebankComponent) suiviVirementsSogebankComponent;
  @ViewChild(RelevesSogebankComponent) relevesSogebankComponent;
  @ViewChild(DocumentsSogebankComponent) documentsSogebankComponent;

  constructor(
    public router: Router,
    private apiService: NodeapiService,
    private sogebankService: SogebankService
  ) { }

  ngOnInit() {
    if (this.apiService.email === '' || this.apiService.email === undefined) {
      this.router.navigate(['/sogebank/login']);
    } else if (this.apiService.permission === Role.DEMANDECOMMERCANT ||
      this.apiService.permission === Role.DEMANDEPARTICULIER) {
      this.router.navigate(['/sogebank/documents']);
    }
    this.setBreadcrumbContent();
  }

  ngAfterViewInit() {
    this.setCurrentChildComponent();
    this.sogebankService.initPortfeuillesData(this.initComponentData, this.childComponent);
  }

  initComponentData(child) {
    child.initData();
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

  setCurrentChildComponent() {
    if (this.router.url === '/sogebank/dashboard') {
      this.childComponent = this.dashboardSogebankComponent;
    } else if (this.router.url === '/sogebank/portefeuilles') {
      this.childComponent = this.portefeuillesSogebankComponent;
    } else if (this.router.url === '/sogebank/cartes') {
      this.childComponent = this.cartesSogebankComponent;
    } else if (this.router.url === '/sogebank/virements') {
      this.childComponent = this.virementsSogebankComponent;
    }  else if (this.router.url === '/sogebank/virements/suivi') {
      this.childComponent = this.suiviVirementsSogebankComponent;
    } else if (this.router.url === '/sogebank/releves') {
      this.childComponent = this.relevesSogebankComponent;
    } else if (this.router.url === '/sogebank/documents') {
      this.childComponent = this.documentsSogebankComponent;
    }
  }

}


