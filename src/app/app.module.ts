import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { NodeapiService } from './nodeapi.service';
import { MatFormFieldModule, MatSelectModule, MatOptionModule, MatButtonModule, MatCheckboxModule,
  MatTabsModule, MatInputModule, MatRadioModule, MatSidenavModule, MatTableModule, MatDialogModule,
  MatSnackBarModule, MatDatepickerModule, MatNativeDateModule, MatPaginatorModule, MatSortModule,
   MatIconModule, MatToolbarModule, MatListModule, MatCardModule, MatMenuModule, MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

// Portal components
import { PortailComponent } from './portail/portail.component';
import { BankButtonComponent } from './portail/bank-button/bank-button.component';
import { AccueilFooterComponent } from './accueil-footer/accueil-footer.component';

// BRH components
import { AccueilBrhComponent } from './brh/accueil-brh/accueil-brh.component';
import { LoginBanquePriveComponent } from './brh/login-banque-prive/login-banque-prive.component';
import { AlertComponent } from './brh/alert/alert.component';
import { EspaceUtilisateurBanquePriveComponent } from './brh/espace-utilisateur-banque-prive/espace-utilisateur-banque-prive.component';
import { DashboardBrhComponent } from './brh/dashboard-brh/dashboard-brh.component';
import { MenuBrhComponent } from './brh/menu-brh/menu-brh.component';
import { LoginBrhComponent } from './brh/login-brh/login-brh.component';
import { EspaceAdminBrhComponent } from './brh/espace-admin-brh/espace-admin-brh.component';
import { HabilitationBrhComponent } from './brh/habilitation-brh/habilitation-brh.component';
import { PortefeuilleBrhComponent } from './brh/portefeuille-brh/portefeuille-brh.component';
import { ParametreBrhComponent } from './brh/parametre-brh/parametre-brh.component';
import { BanqueComponent } from './brh/habilitation-brh/banque/banque.component';
import { BanqueListComponent } from './brh/habilitation-brh/banque-list/banque-list.component';

// Sogebank components
import { AccueilSogebankComponent } from './sogebank/accueil-sogebank/accueil-sogebank.component';
import { LoginSogebankComponent } from './sogebank/login-sogebank/login-sogebank.component';
import { EspaceUtilisateurSogebankComponent } from './sogebank/espace-utilisateur-sogebank/espace-utilisateur-sogebank.component';
import { MenuSogebankComponent } from './sogebank/menu-sogebank/menu-sogebank.component';
import { DashboardSogebankComponent } from './sogebank/dashboard-sogebank/dashboard-sogebank.component';
import { PortefeuillesSogebankComponent } from './sogebank/portefeuilles-sogebank/portefeuilles-sogebank.component';
import { CartesSogebankComponent } from './sogebank/cartes-sogebank/cartes-sogebank.component';
import { VirementsSogebankComponent } from './sogebank/virements-sogebank/virements-sogebank.component';
import { SuiviVirementsSogebankComponent } from './sogebank/suivi-virements-sogebank/suivi-virements-sogebank.component';
import { RelevesSogebankComponent } from './sogebank/releves-sogebank/releves-sogebank.component';
import { BreadcrumbSearchSogebankComponent } from './sogebank/breadcrumb-search-sogebank/breadcrumb-search-sogebank.component';
import { TableReleveSogebankComponent } from './sogebank/table-releve/table-releve-sogebank.component';
import { DocumentsSogebankComponent } from './sogebank/documents-sogebank/documents-sogebank.component'
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule  } from 'ngx-pagination';

import 'hammerjs';
import { CommonLoginComponent } from './common/common-login/common-login.component';
import { MenuBanquePriveComponent } from './brh/menu-banque-prive/menu-banque-prive.component';
import { SidenavBanquePriveComponent } from './brh/sidenav-banque-prive/sidenav-banque-prive.component';
import { PortefeuilleBanquePriveComponent } from './brh/portefeuille-banque-prive/portefeuille-banque-prive.component';
import { TransactionsBanquePriveComponent } from './brh/transactions-banque-prive/transactions-banque-prive.component';
import { ClientsBanquePriveComponent } from './brh/clients-banque-prive/clients-banque-prive.component';
import { CartesBanquePriveComponent } from './brh/cartes-banque-prive/cartes-banque-prive.component';
import { ReleveBrhComponent } from './brh/releve-brh/releve-brh.component';
import { PortefeuillePrincipalBrhComponent } from './brh/portefeuille-principal-brh/portefeuille-principal-brh.component';
import { DemandeHabilitationComponent } from './brh/demande-habilitation/demande-habilitation.component';
import { TableMonnieElectroniqueComponent } from './brh/parametre-brh/table-monnie-electronique/table-monnie-electronique.component';
import { TableMonniePhysiqueComponent } from './brh/parametre-brh/table-monnie-physique/table-monnie-physique.component';
import { ClientBanquePriveComponent } from './brh/client-banque-prive/client-banque-prive.component';
import { ParametresBrhComponent } from './brh/parametres-brh/parametres-brh.component';
import { InfoPersonelBanquePriveComponent } from './brh/info-personel-banque-prive/info-personel-banque-prive.component';
import { TransactionTableBanquePriveComponent } from './brh/transaction-table-banque-prive/transaction-table-banque-prive.component';
import { VirementsBanquePriveComponent } from './brh/virements-banque-prive/virements-banque-prive.component';
import { CommonCarteComponent } from './common/common-carte/common-carte.component';
import { DocumentBanquePriveComponent } from './brh/document-banque-prive/document-banque-prive.component';
import { CommonEmailValidationComponent } from './common/common-email-validation/common-email-validation.component';
import { CommonLoadingAnimationComponent } from './common/common-loading-animation/common-loading-animation.component';

@NgModule({
  declarations: [
    AppComponent,
    // Portal
    PortailComponent,
    BankButtonComponent,
    // BRH
    AccueilBrhComponent,
    DashboardBrhComponent,
    MenuBrhComponent,
    LoginBrhComponent,
    EspaceAdminBrhComponent,
    HabilitationBrhComponent,
    PortefeuilleBrhComponent,
    ParametreBrhComponent,
    ParametresBrhComponent,
    EspaceUtilisateurBanquePriveComponent,
    LoginBanquePriveComponent,
    AlertComponent,
    // Sogebank
    AccueilSogebankComponent,
    LoginSogebankComponent,
    EspaceUtilisateurSogebankComponent,
    BreadcrumbSearchSogebankComponent,
    MenuSogebankComponent,
    DashboardSogebankComponent,
    PortefeuillesSogebankComponent,
    CartesSogebankComponent,
    VirementsSogebankComponent,
    RelevesSogebankComponent,
    TableReleveSogebankComponent,
    AccueilFooterComponent,
    DocumentsSogebankComponent,
    LoginBanquePriveComponent,
    AlertComponent,
    EspaceUtilisateurBanquePriveComponent,
    DashboardBrhComponent,
    MenuBrhComponent,
    LoginBrhComponent,
    EspaceAdminBrhComponent,
    HabilitationBrhComponent,
    PortefeuilleBrhComponent,
    BanqueComponent,
    BanqueListComponent,
    SuiviVirementsSogebankComponent,
    CommonLoginComponent,
    MenuBanquePriveComponent,
    SidenavBanquePriveComponent,
    PortefeuilleBanquePriveComponent,
    TransactionsBanquePriveComponent,
    ClientsBanquePriveComponent,
    CartesBanquePriveComponent,
    ReleveBrhComponent,
    PortefeuillePrincipalBrhComponent,
    DemandeHabilitationComponent,
    TableMonnieElectroniqueComponent,
    TableMonniePhysiqueComponent,
    ClientBanquePriveComponent,
    InfoPersonelBanquePriveComponent,
    TransactionTableBanquePriveComponent,
    VirementsBanquePriveComponent,
    CommonCarteComponent,
    DocumentBanquePriveComponent,
    CommonEmailValidationComponent,
    CommonLoadingAnimationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatInputModule,
    MatRadioModule,
    MatSidenavModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatPaginatorModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FlexLayoutModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule
  ],
  entryComponents: [EspaceUtilisateurBanquePriveComponent, InfoPersonelBanquePriveComponent],
  providers: [
    Title,
    NodeapiService
  ],
  bootstrap: [AppComponent],


})
export class AppModule { }
