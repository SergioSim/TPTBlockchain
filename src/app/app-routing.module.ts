import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BanqueCentraleComponent } from './banque-centrale/banque-centrale.component';
import { BanqueCommercialeComponent } from './banque-commerciale/banque-commerciale.component';
import { CommercantComponent } from './commercant/commercant.component';
import { ParticulierComponent } from './particulier/particulier.component';
import { AccueilComponent } from './accueil/accueil.component';

const routes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'accueil', component: AccueilComponent },
  { path: 'banqueCentrale', component: BanqueCentraleComponent },
  { path: 'banqueCommerciale', component: BanqueCommercialeComponent },
  { path: 'commercant', component: CommercantComponent },
  { path: 'particulier', component: ParticulierComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
