import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { faClipboard, faUserFriends, faChevronDown, faCheck, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';

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
  transferAmount: number;
  selectedType: string;
  confirmDialogRef: any;
  dialogProperties = {
    from: '',
    to: '',
    amount: '',
    afterTransfer: '',
    type: '',
    date: ''
  };
  typesVirement = [
    {value: 'classique', viewValue: 'Classique'},
    {value: 'paiement', viewValue: 'Paiement'},
    {value: 'depot', viewValue: 'Dépôt'},
    {value: 'retrait', viewValue: 'Retrait'}
  ];

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private titleService: Title,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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

  checkConfirmState() {
    if (Object.entries(this.selectedBeneficiaire).length > 0 && Object.entries(this.selectedPortefeuille).length > 0
        && this.transferAmount !== undefined && this.transferAmount !== null && this.selectedType !== undefined) {
      return false;
    }
    return true;
  }

  updateDialogProperties() {
    this.dialogProperties.from = this.selectedPortefeuille['libelle'];
    this.dialogProperties.to = this.selectedBeneficiaire['libelle'];
    this.dialogProperties.amount = this.transferAmount.toString();
    this.dialogProperties.afterTransfer = (Number(this.selectedPortefeuille['solde']
      .substring(0, this.selectedPortefeuille['solde'].length - 5).replace(' ', '')) - this.transferAmount).toString();
    this.dialogProperties.type = this.typesVirement.find(obj => obj.value === this.selectedType).viewValue;
    this.dialogProperties.date = new Date().toLocaleDateString();
  }

  openConfirmDialog(templateRef) {
    if (this.transferAmount >
      Number(this.selectedPortefeuille['solde'].substring(0, this.selectedPortefeuille['solde'].length - 5).replace(' ', ''))) {
        this.snackBar.open('Le montant du virement ne peut pas excéder le solde du portefeuille.', 'Fermer', {
          duration: 2000,
        });
    } else {
      this.updateDialogProperties();
      this.confirmDialogRef = this.dialog.open(templateRef);
      this.confirmDialogRef.afterClosed().subscribe(result => {

      });
    }
  }

  confirmTransfer() {
    this.confirmDialogRef.close();

    this.snackBar.open('Le virement de ' + this.transferAmount + ' DHTG vers '
      + this.dialogProperties.to + ' à bien été effectué.', 'Fermer', {
      duration: 2000,
    });
  }

  cancelTransfer() {
    this.confirmDialogRef.close();
  }

}


