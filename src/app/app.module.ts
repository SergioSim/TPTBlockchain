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
  MatSnackBarModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';

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
import { LiquiditeBrhComponent } from './brh/liquidite-brh/liquidite-brh.component';
import { ParametreBrhComponent } from './brh/parametre-brh/parametre-brh.component';

// Sogebank components
import { AccueilSogebankComponent } from './sogebank/accueil-sogebank/accueil-sogebank.component';
import { LoginSogebankComponent } from './sogebank/login-sogebank/login-sogebank.component';
import { EspaceUtilisateurSogebankComponent } from './sogebank/espace-utilisateur-sogebank/espace-utilisateur-sogebank.component';
import { MenuSogebankComponent } from './sogebank/menu-sogebank/menu-sogebank.component';
import { DashboardSogebankComponent } from './sogebank/dashboard-sogebank/dashboard-sogebank.component';
import { PortefeuillesSogebankComponent } from './sogebank/portefeuilles-sogebank/portefeuilles-sogebank.component';
import { CartesSogebankComponent } from './sogebank/cartes-sogebank/cartes-sogebank.component';
import { VirementsSogebankComponent } from './sogebank/virements-sogebank/virements-sogebank.component';
import { RelevesSogebankComponent } from './sogebank/releves-sogebank/releves-sogebank.component';
import { BreadcrumbSearchSogebankComponent } from './sogebank/breadcrumb-search-sogebank/breadcrumb-search-sogebank.component';
import { TableReleveSogebankComponent } from './sogebank/table-releve/table-releve-sogebank.component';

import 'hammerjs';


@NgModule({
  declarations: [
    AppComponent,
    PortailComponent,
    BankButtonComponent,
    AccueilBrhComponent,
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
    TableReleveSogebankComponent,
    LoginBanquePriveComponent,
    AlertComponent,
    EspaceUtilisateurBanquePriveComponent,
    DashboardBrhComponent,
    MenuBrhComponent,
    LoginBrhComponent,
    EspaceAdminBrhComponent,
    HabilitationBrhComponent,
    PortefeuilleBrhComponent,
    LiquiditeBrhComponent,
    ParametreBrhComponent
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
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule
  ],
  providers: [
    Title,
    NodeapiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
