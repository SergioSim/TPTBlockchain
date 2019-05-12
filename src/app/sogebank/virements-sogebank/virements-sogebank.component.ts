import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { faClipboard, faUserFriends, faChevronDown, faCheck, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

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
  faCheckCircle = faCheckCircle;

  portefeuilles: any[];
  beneficiaires: any[];
  isPortefeuilleSelected = false;
  isBeneficiaireSelected = false;
  selectedPortefeuille = {};
  selectedBeneficiaire = {};
  typesVirement = [
    {value: 'classique', viewValue: 'Classique'},
    {value: 'paiement', viewValue: 'Paiement'},
    {value: 'depot', viewValue: 'Dépôt'},
    {value: 'retrait', viewValue: 'Retrait'}
  ];

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

  selectPortefeuille(portefeuille) {
    this.selectedPortefeuille = portefeuille;
    this.isPortefeuilleSelected = true;
  }

  selectBeneficiaire(beneficiaire) {
    this.selectedBeneficiaire = beneficiaire;
    this.isBeneficiaireSelected = true;
  }

  choosePortefeuille() {
    this.isPortefeuilleSelected = false;
  }

  chooseBeneficiaire() {
    this.isBeneficiaireSelected = false;
  }

}


