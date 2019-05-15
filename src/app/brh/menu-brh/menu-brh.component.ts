import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-brh',
  templateUrl: './menu-brh.component.html',
  styleUrls: ['./menu-brh.component.css']
})
export class MenuBrhComponent implements OnInit {

  
  constructor( private route: Router
    ) { 

  }

  ngOnInit() {
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

  goTocontrole() {
    this.route.navigate(['/brh/controle-brh']);
  }

  goToliquidite() {
    this.route.navigate(['/brh/liquidite-brh']);
  }

}
