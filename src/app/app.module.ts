import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BanqueCommercialeComponent } from './banque-commerciale/banque-commerciale.component';
import { BanqueCentraleComponent } from './banque-centrale/banque-centrale.component';
import { CommercantComponent } from './commercant/commercant.component';
import { ParticulierComponent } from './particulier/particulier.component';
import { AccueilComponent } from './accueil/accueil.component';
import { BankButtonComponent } from './accueil/bank-button/bank-button.component';

@NgModule({
  declarations: [
    AppComponent,
    BankButtonComponent,
    BanqueCommercialeComponent,
    BanqueCentraleComponent,
    CommercantComponent,
    ParticulierComponent,
    AccueilComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
