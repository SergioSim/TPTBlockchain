import { Component, OnInit } from '@angular/core';
import { faPlus, faUnlockAlt, faUser, faStoreAlt, faCreditCard } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sogebank',
  templateUrl: './sogebank.component.html',
  styleUrls: ['./sogebank.component.css']
})
export class SogebankComponent implements OnInit {
  faPlus = faPlus;
  faUnlockAlt = faUnlockAlt;
  faUser = faUser;
  faStoreAlt = faStoreAlt;
  faCreditCard = faCreditCard;

  constructor() { }

  ngOnInit() {
  }

}
