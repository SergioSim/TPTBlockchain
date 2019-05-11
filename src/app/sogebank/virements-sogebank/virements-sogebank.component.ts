import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { faClipboard, faUserFriends, faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-virements-sogebank',
  templateUrl: './virements-sogebank.component.html',
  styleUrls: ['./virements-sogebank.component.css']
})
export class VirementsSogebankComponent implements OnInit {
  faClipboard = faClipboard;
  faUserFriends = faUserFriends;
  faChevronDown = faChevronDown;
  faCheck = faCheck;

  portefeuilles: any[];
  beneficiaires: any[];
  isPortefeuilleSelected = false;
  isBeneficiaireSelecter = false;
  selectedPortefeuille = {id: 1, libelle: 'Portefeuille courant', solde: '12 386 DHTG', ouverture: '14/01/2019', activite: '+1 189 DHTG'};
  selectedBeneficiaire = {};

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Virements - Sogebank');

    this.portefeuilles = this.sogebankService.getUserWallets();
    this.beneficiaires = this.sogebankService.getUserContacts();
  }

}


