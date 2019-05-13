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

import { MatFormFieldModule, MatSelectModule, MatOptionModule, MatButtonModule, MatCheckboxModule,
   MatTabsModule, MatInputModule, MatRadioModule, MatSidenavModule, MatTableModule, MatDialogModule,
   MatSnackBarModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { NodeapiService } from './nodeapi.service';

import 'hammerjs';

import { LoginComponent } from './sogebank/Particulier/login/login.component';
import { AccueilComponent } from './sogebank/Particulier/accueil/accueil.component';
import { EspaceUtilisateurParticulierComponent } from './sogebank/Particulier/espace-utilisateur-particulier/espace-utilisateur-particulier.component';

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
    LoginComponent,
    AccueilComponent,
    EspaceUtilisateurParticulierComponent
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
    HttpClientModule
  ],
  providers: [
    Title,
    NodeapiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
