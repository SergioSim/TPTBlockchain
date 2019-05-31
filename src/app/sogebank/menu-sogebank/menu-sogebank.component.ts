import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Role } from '../Role';

@Component({
  selector: 'app-menu-sogebank',
  templateUrl: './menu-sogebank.component.html',
  styleUrls: ['./menu-sogebank.component.css']
})
export class MenuSogebankComponent implements OnInit {
  userFullname: string;
  userAvatarUrl: string;
  roles = Role;

  constructor(
    private route: Router,
    public sogebankService: SogebankService
  ) { }

  ngOnInit() {
  }

  goToDashboard() {
    this.route.navigate(['/sogebank/dashboard']);
  }

  goToWallets() {
    this.route.navigate(['/sogebank/portefeuilles']);
  }

  goToCards() {
    this.route.navigate(['/sogebank/cartes']);
  }

  goToTransfers() {
    this.route.navigate(['/sogebank/virements']);
  }

  goToStatements() {
    this.route.navigate(['/sogebank/releves']);
  }

  goToDocuments() {
    this.route.navigate(['/sogebank/documents']);
  }

}


