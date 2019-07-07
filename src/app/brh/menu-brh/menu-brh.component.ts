import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NodeapiService } from 'src/app/nodeapi.service';

@Component({
  selector: 'app-menu-brh',
  templateUrl: './menu-brh.component.html',
  styleUrls: ['./menu-brh.component.css']
})
export class MenuBrhComponent implements OnInit {
  
  constructor( private route: Router,
               private apiService: NodeapiService
    ) { 
  }

  ngOnInit() {
  }

  goToPortefeuillePrincipal(){
    this.route.navigate(['/brh/portefeuille-principal-brh']);
  }

  goToDashboard() {
    this.route.navigate(['/brh/dashboard-brh']);
  }

  goTohabilitation() {
    this.route.navigate(['/brh/habilitation-brh']);
  }

  goToportefeuille() {
    this.route.navigate(['/brh/portefeuille-brh']);
  }

  goToparametre() {
    this.route.navigate(['/brh/parametre-brh']);
  }

  goToliquidite() {
    this.route.navigate(['/brh/liquidite-brh']);
  }
  goToreleve(){
    this.route.navigate(['/brh/releve-brh']);
  }

  goToparametres() {
    this.route.navigate(['/brh/parametres-brh']);
  }

  disconnect() {
    this.apiService.logout();
    this.route.navigate(['/brh/login-brh']);
  }
}
