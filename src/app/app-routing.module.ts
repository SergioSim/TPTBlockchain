import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccueilBrhComponent } from './brh/accueil-brh/accueil-brh.component';
import { AccueilSogebankComponent } from './sogebank/accueil-sogebank/accueil-sogebank.component';
import { PortailComponent } from './portail/portail.component';
import { LoginSogebankComponent } from './sogebank/login-sogebank/login-sogebank.component';
import { EspaceUtilisateurSogebankComponent } from './sogebank/espace-utilisateur-sogebank/espace-utilisateur-sogebank.component';
import { EspaceUtilisateurParticulierComponent } from './sogebank/Particulier/espace-utilisateur-particulier/espace-utilisateur-particulier.component';
import { LoginBanquePriveComponent } from './brh/login-banque-prive/login-banque-prive.component'
import { EspaceUtilisateurBanquePriveComponent } from './brh/espace-utilisateur-banque-prive/espace-utilisateur-banque-prive.component'
import { EspaceAdminBrhComponent } from './brh/espace-admin-brh/espace-admin-brh.component'

import { LoginComponent } from './sogebank/Particulier/login/login.component';
import { LoginBrhComponent } from './brh/login-brh/login-brh.component';

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
  { path: 'sogebank/Particulier/login', component:  LoginComponent},
  { path: 'brh/login-brh', component:  LoginBrhComponent},
  { path: 'brh/dashboard-brh', component:  EspaceAdminBrhComponent},
  { path: 'sogebank/Particulier/accueil', component:  EspaceUtilisateurParticulierComponent},
  { path: 'brh/banque/prive/dashboard', component:  EspaceUtilisateurBanquePriveComponent},
  { path: 'sogebank/Particulier/releves-particulier', component:  EspaceUtilisateurParticulierComponent},
  { path: 'sogebank/Particulier/cartes-particulier', component:  EspaceUtilisateurParticulierComponent},
  { path: 'sogebank/Particulier/virements-particulier', component:  EspaceUtilisateurParticulierComponent},
  { path: 'sogebank/Particulier/inscription-particulier', component:  EspaceUtilisateurParticulierComponent}


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
