import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccueilBrhComponent } from './brh/accueil-brh/accueil-brh.component';
import { AccueilSogebankComponent } from './sogebank/accueil-sogebank/accueil-sogebank.component';
import { PortailComponent } from './portail/portail.component';
import { BankButtonComponent } from './portail/bank-button/bank-button.component';

@NgModule({
  declarations: [
    AppComponent,
    BankButtonComponent,
    AccueilBrhComponent,
    AccueilSogebankComponent,
    PortailComponent,
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
