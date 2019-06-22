import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { faClipboard, faUserFriends, faChevronDown, faCheck, faCheckCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';
import { CommonUtilsService } from 'src/app/common/common-utils.service';

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
  faPlus = faPlus;

  portefeuilles: any[];
  beneficiaires: any[];
  isPortefeuilleSelected = false;
  isBeneficiaireSelected = false;
  selectedPortefeuille = {};
  selectedBeneficiaire = {};
  transferAmount: number;
  selectedType: string;
  confirmDialogRef: any;
  contactDialogRef: any;
  editBeneficiaire: {};
  newBeneficiaireLibelle: string;
  newBeneficiaireClePub: string;
  dialogProperties = {
    from: '',
    to: '',
    amount: '',
    afterTransfer: '',
    type: '',
    date: ''
  };
  typesVirement = [
    {value: 'Virement', viewValue: 'Classique'},
    {value: 'Paiement', viewValue: 'Paiement'},
    {value: 'Depôt HTG', viewValue: 'Dépôt HTG'},
    {value: 'Retrait HTG', viewValue: 'Retrait HTG'}
  ];

  constructor(
    private route: Router,
    public apiService: NodeapiService,
    private sogebankService: SogebankService,
    private commonUtilsService: CommonUtilsService,
    private titleService: Title,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Virements - Sogebank');
    this.editBeneficiaire = { ClePub: '', Libelle: '' };
  }

  initData() {
    this.portefeuilles = this.apiService.portefeuilles;
    this.beneficiaires = this.apiService.contacts;
  }

  getContacts() {
    this.apiService.makeRequest(apiUrl.contactsByUserEmail, {}).toPromise()
      .then(res => {
        this.apiService.contacts = res;
        this.initData();
      });
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
    this.dialogProperties.from = this.selectedPortefeuille['Libelle'];
    this.dialogProperties.to = this.selectedBeneficiaire['Libelle'];
    this.dialogProperties.amount = this.transferAmount.toString();
    this.dialogProperties.afterTransfer = (Number(this.selectedPortefeuille['Solde']
      .substring(0, this.selectedPortefeuille['Solde'].length - 5).replace(' ', '')) - this.transferAmount).toString();
    this.dialogProperties.type = this.typesVirement.find(obj => obj.value === this.selectedType).viewValue;
    this.dialogProperties.date = new Date().toLocaleDateString();
  }

  openConfirmDialog(templateRef) {
    if (this.transferAmount >
      Number(this.selectedPortefeuille['Solde'].substring(0, this.selectedPortefeuille['Solde'].length - 5).replace(' ', ''))) {
        this.snackBar.open('Le montant du virement ne peut pas excéder le solde du portefeuille.', 'Fermer', {
          duration: 5000,
        });
    } else if (this.selectedPortefeuille['Id'] === this.selectedBeneficiaire['Id']) {
      this.snackBar.open('Les portefeuilles source et bénéficiaire ne peuvent pas être les même.', 'Fermer', {
        duration: 5000,
      });
    } else {
      this.updateDialogProperties();
      this.confirmDialogRef = this.dialog.open(templateRef);
      this.confirmDialogRef.afterClosed().subscribe(result => {

      });
    }
  }

  confirmTransfer() {
    const transferDetails = {
      //TEMPORARY PASSWORD HACK
      password: 'aPassword',
      id: this.selectedPortefeuille['Id'],
      clePubDestinataire: this.selectedBeneficiaire['ClePub'],
      montant: this.transferAmount,
      memo: this.selectedType
    };
    this.apiService.makeRequest(apiUrl.transferTo, transferDetails).toPromise()
      .then(res => {
        this.sogebankService.initPortfeuillesData(this.initData, null);
        this.confirmDialogRef.close();
        this.snackBar.open('Le virement de ' + this.transferAmount + ' DHTG vers '
          + this.dialogProperties.to + ' à bien été effectué.', 'Fermer', {
          duration: 5000,
        });
      }, error => {
        this.snackBar.open('Le virement n\'a pas pu aboutir, veuillez réessayer.', 'Fermer', {
          duration: 5000,
        });
      });


  }

  cancelTransfer() {
    this.confirmDialogRef.close();
  }

  openContactDialog(templateRef) {
    this.contactDialogRef = this.dialog.open(templateRef, {width: '350px'});
    this.contactDialogRef.afterClosed().subscribe(result => {

   });
  }

  confirmContactEditCreate() {
    if (this.editBeneficiaire === 'newContact') {
      // Create
      if (!this.newBeneficiaireLibelle && !this.newBeneficiaireClePub) {
        this.snackBar.open('Veuillez renseigner tous les champs.', 'Fermer', {
          duration: 5000,
        });
        return;
      }
      const newContactDetails = {
        libelle: this.newBeneficiaireLibelle,
        clePub: this.newBeneficiaireClePub
      };
      this.apiService.makeRequest(apiUrl.createContact, newContactDetails).toPromise()
        .then(res => {
          this.getContacts();
          this.contactDialogRef.close();
          this.snackBar.open(newContactDetails.libelle + ' à bien été ajouté à vos bénéficiaires.', 'Fermer', {
            duration: 5000,
          });
        }, error => {
          this.snackBar.open('Le bénéficiaire n\'a pas pu être ajouté, veuillez réessayer.', 'Fermer', {
            duration: 5000,
          });
        });
    } else {
      // Edit
      if (!this.editBeneficiaire['Libelle'] && !this.editBeneficiaire['ClePub']) {
        this.snackBar.open('Veuillez renseigner tous les champs.', 'Fermer', {
          duration: 5000,
        });
        return;
      }
      const editContactDetails = {
        libelle: this.editBeneficiaire['Libelle'],
        clePub: this.editBeneficiaire['ClePub'],
        id: this.editBeneficiaire['Id']
      };
      this.apiService.makeRequest(apiUrl.updateContact, editContactDetails).toPromise()
        .then(res => {
          this.getContacts();
          this.contactDialogRef.close();
          this.snackBar.open('Les informations du bénéficiaire ' + this.editBeneficiaire['Libelle']
          + ' ont bien été mises à jour.', 'Fermer', {
            duration: 5000,
          });
        }, error => {
          this.snackBar.open('Le bénéficiaire n\'a pas pu être mis à jour, veuillez réessayer.', 'Fermer', {
            duration: 5000,
          });
        });
    }
  }

  changeBeneficiaireLibelle(event) {
    if (this.editBeneficiaire === 'newContact') {
      this.newBeneficiaireLibelle = event.target.value;
    }
  }

  changeBeneficiaireClePub(event) {
    if (this.editBeneficiaire === 'newContact') {
      this.newBeneficiaireClePub = event.target.value;
    }
  }

  cancelContactEditCreate() {
    this.contactDialogRef.close();
  }

  goToTransfersStatement() {
    this.route.navigate(['/sogebank/virements/suivi']);
  }

}


