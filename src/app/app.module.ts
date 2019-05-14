import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccueilBrhComponent } from './brh/accueil-brh/accueil-brh.component';
import { AccueilSogebankComponent } from './sogebank/accueil-sogebank/accueil-sogebank.component';
import { PortailComponent } from './portail/portail.component';
import { BankButtonComponent } from './portail/bank-button/bank-button.component';
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
import { MenuParticulierComponent } from './sogebank/Particulier/menu-particulier/menu-particulier.component';
import { RelevesParticulierComponent } from './sogebank/Particulier/releves-particulier/releves-particulier.component';
import { CartesParticulierComponent } from './sogebank/Particulier/cartes-particulier/cartes-particulier.component';
import { VirementsParticulierComponent } from './sogebank/Particulier/virements-particulier/virements-particulier.component';
import { BreadcrumbSearchParticulierComponent } from './sogebank/Particulier/breadcrumb-search-particulier/breadcrumb-search-particulier.component';


import { MatFormFieldModule, MatSelectModule, MatOptionModule, MatButtonModule, MatCheckboxModule,
   MatTabsModule, MatInputModule, MatRadioModule, MatSidenavModule, MatTableModule, MatDialogModule,
   MatSnackBarModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { NodeapiService } from './nodeapi.service';

import 'hammerjs';

import { LoginComponent } from './sogebank/Particulier/login/login.component';
import { AccueilComponent } from './sogebank/Particulier/accueil/accueil.component';
import { EspaceUtilisateurParticulierComponent } from './sogebank/Particulier/espace-utilisateur-particulier/espace-utilisateur-particulier.component';
import { AccueilFooterComponent } from './accueil-footer/accueil-footer.component';
import { LoginBanquePriveComponent } from './brh/login-banque-prive/login-banque-prive.component';
import { AlertComponent } from './brh/alert/alert.component';
import { EspaceUtilisateurBanquePriveComponent } from './brh/espace-utilisateur-banque-prive/espace-utilisateur-banque-prive.component';


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
    LoginComponent,
    AccueilComponent,
    EspaceUtilisateurParticulierComponent,
    MenuParticulierComponent,
    RelevesParticulierComponent,
    CartesParticulierComponent,
    VirementsParticulierComponent,
    BreadcrumbSearchParticulierComponent,
    AccueilFooterComponent,
    TableReleveSogebankComponent,
    LoginBanquePriveComponent,
    AlertComponent,
    EspaceUtilisateurBanquePriveComponent
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
