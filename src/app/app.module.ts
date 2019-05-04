import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrhComponent } from './brh/brh.component';
import { SogebankComponent } from './sogebank/sogebank.component';
import { AccueilComponent } from './accueil/accueil.component';
import { BankButtonComponent } from './accueil/bank-button/bank-button.component';

@NgModule({
  declarations: [
    AppComponent,
    BankButtonComponent,
    BrhComponent,
    SogebankComponent,
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
