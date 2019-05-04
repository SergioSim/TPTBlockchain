import { Component, OnInit } from '@angular/core';
import { faPlus, faUnlockAlt, faUser, faStoreAlt, faCreditCard } from '@fortawesome/free-solid-svg-icons';

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

  constructor() { }

  ngOnInit() {
  }

}
