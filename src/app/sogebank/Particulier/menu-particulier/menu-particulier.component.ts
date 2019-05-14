import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-particulier',
  templateUrl: './menu-particulier.component.html',
  styleUrls: ['./menu-particulier.component.css']
})
export class MenuParticulierComponent implements OnInit {

  userFullname: string;
  userAvatarUrl: string;

  constructor(        private route: Router
    ) { 

  }

  ngOnInit() {
  }


  goToAccueil() {
    this.route.navigate(['/sogebank/Particulier/accueil']);
  }

  goToCards() {
    this.route.navigate(['/sogebank/Particulier/cartes-particulier']);
  }

  goToTransfers() {
    this.route.navigate(['/sogebank/Particulier/virements-particulier']);
  }

  goToStatements() {
    this.route.navigate(['/sogebank/Particulier/releves-particulier']);
  }

}


