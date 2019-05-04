import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccueilBrhComponent } from './brh/accueil-brh/accueil-brh.component';
import { AccueilSogebankComponent } from './sogebank/accueil-sogebank/accueil-sogebank.component';
import { PortailComponent } from './portail/portail.component';

const routes: Routes = [
  { path: '', redirectTo: '/portail', pathMatch: 'full' },
  { path: 'portail', component: PortailComponent },
  { path: 'brh/accueil', component: AccueilBrhComponent },
  { path: 'sogebank/accueil', component: AccueilSogebankComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
