import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrhComponent } from './brh/brh.component';
import { SogebankComponent } from './sogebank/sogebank.component';
import { AccueilComponent } from './accueil/accueil.component';

const routes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'accueil', component: AccueilComponent },
  { path: 'brh', component: BrhComponent },
  { path: 'sogebank', component: SogebankComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
