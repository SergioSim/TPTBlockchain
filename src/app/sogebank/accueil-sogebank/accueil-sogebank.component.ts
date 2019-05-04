import { Component, OnInit } from '@angular/core';
import { faPlus, faUnlockAlt, faUser, faStoreAlt, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { SogebankService } from '../sogebank.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-accueil-sogebank',
  templateUrl: './accueil-sogebank.component.html',
  styleUrls: ['./accueil-sogebank.component.css']
})
export class AccueilSogebankComponent implements OnInit {
  faPlus = faPlus;
  faUnlockAlt = faUnlockAlt;
  faUser = faUser;
  faStoreAlt = faStoreAlt;
  faCreditCard = faCreditCard;

  constructor(
    private route: Router,
    private sogebankService: SogebankService
  ) { }

  ngOnInit() {
  }

  goToLoginConnect() {
    this.sogebankService.displayLoginForm = true;
    this.route.navigate(['/sogebank/login']);
  }

  goToLoginCreate() {
    this.sogebankService.displayLoginForm = false;
    this.route.navigate(['/sogebank/login']);
  }

}
