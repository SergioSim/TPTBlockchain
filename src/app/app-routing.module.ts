import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccueilBrhComponent } from './brh/accueil-brh/accueil-brh.component';
import { AccueilSogebankComponent } from './sogebank/accueil-sogebank/accueil-sogebank.component';
import { PortailComponent } from './portail/portail.component';
import { LoginSogebankComponent } from './sogebank/login-sogebank/login-sogebank.component';
import { EspaceUtilisateurSogebankComponent } from './sogebank/espace-utilisateur-sogebank/espace-utilisateur-sogebank.component';
import { LoginComponent } from './sogebank/Particulier/login/login.component';
const routes: Routes = [
  { path: '', redirectTo: '/portail', pathMatch: 'full' },
  { path: 'portail', component: PortailComponent },
  { path: 'brh/accueil', component: AccueilBrhComponent },
  { path: 'sogebank/accueil', component: AccueilSogebankComponent },
  { path: 'sogebank/login', component: LoginSogebankComponent},
  { path: 'sogebank/dashboard', component: EspaceUtilisateurSogebankComponent},
  { path: 'sogebank/portefeuilles', component: EspaceUtilisateurSogebankComponent},
  { path: 'sogebank/cartes', component: EspaceUtilisateurSogebankComponent},
  { path: 'sogebank/virements', component: EspaceUtilisateurSogebankComponent},
  { path: 'sogebank/releves', component: EspaceUtilisateurSogebankComponent},
  { path: 'sogebank/Particulier/login', component:  LoginComponent}

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
