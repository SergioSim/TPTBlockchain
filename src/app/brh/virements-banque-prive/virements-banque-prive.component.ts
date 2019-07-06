import { Component, OnInit } from '@angular/core';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';
import { BanqueClient } from '../clients-banque-prive/clients-banque-prive.component';
import { MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { faClipboard, faUserFriends, faChevronDown, faCheck, faCheckCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormControl, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { from } from 'rxjs';


@Component({
  selector: 'app-virements-banque-prive',
  templateUrl: './virements-banque-prive.component.html',
  styleUrls: ['./virements-banque-prive.component.css']
})

// Copy Paste and arranged From Luke
export class VirementsBanquePriveComponent implements OnInit {

  public clients: Array<BanqueClient>;
  public selectedPortefeuille;
  public isBeneficiaireSelected;
  public selectedSolde;
  public selectedBeneficiaire: BanqueClient;
  public editBeneficiaire: {};
  public newBeneficiaireLibelle: string;
  public newBeneficiaireClePub: string;
  public transferAmount: number;
  public selectedType: string;
  public confirmDialogRef: any;
  public transferPassword: string;
  private contactDialogRef: any;
  motifFC: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  faCheck = faCheck;
  faClipboard = faClipboard;
  faUserFriends = faUserFriends;
  faChevronDown = faChevronDown;
  faCheckCircle = faCheckCircle;
  faPlus = faPlus;
  dialogProperties = {
    from: '',
    to: '',
    amount: '',
    afterTransfer: '',
    type: '',
    date: ''
  };
  public typesVirement = [
    {value: 'Paiement', viewValue: 'Paiement'},
    {value: 'Dépôt HTG', viewValue: 'Dépôt HTG'},
    {value: 'Retrait HTG', viewValue: 'Retrait HTG'},
    {value: 'Autre', viewValue: 'Autre...'}
  ];
  public roles: any[] = ['Public', 'DemandeParticulier', 'DemandeCommercant', 'DemandeBanque',
  'Particulier', 'Commercant', 'Banque', 'Admin'];

  constructor(
    private apiService: NodeapiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.selectedPortefeuille = this.apiService.portefeuilles[0];
    this.editBeneficiaire = { ClePub: '', Libelle: '' };
    this.apiService.makeRequest(apiUrl.clients, {banque: this.apiService.banque}).subscribe(
      res => {
        this.apiService.bankClients = res;
        this.clients = res;
      }, err => {
        console.log('err : ');
        console.log(err);
        if (err.status === 403) {
          this.apiService.logout();
          this.router.navigate(['/brh/accueil']);
          this.snackBar.open('Votre session a expire!', 'Fermer', {
            duration: 5000,
            panelClass: ['alert-snackbar']
          });
        }
      }
    );
    this.apiService.getRecord(this.apiService.portefeuilles[0].ClePub).subscribe(data => {
      this.selectedSolde = data[0].balance;
    });
    console.log('clients', this.clients);
  }

  selectBeneficiaire(beneficiaire: BanqueClient) {
    this.selectedBeneficiaire = beneficiaire;
    this.isBeneficiaireSelected = true;
  }

  openContactDialog(templateRef) {
    this.contactDialogRef = this.dialog.open(templateRef, {width: '350px'});
    this.contactDialogRef.afterClosed().subscribe(result => {
   });
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

  chooseBeneficiaire() {
    this.isBeneficiaireSelected = false;
  }

  applyFilter(afilter: string, itype: string) {
    // Probably a VERY INEFFICIENT way to filter ... \o?
    afilter = afilter.trim().toLowerCase();
    this.clients = this.apiService.bankClients;
    const arr: Array<BanqueClient> = [];
    if (afilter !== null || afilter !== '') {
      from(this.clients).pipe(filter( data => data[itype].trim().toLowerCase().indexOf(afilter) !== -1)).subscribe(res => arr.push(res));
      this.clients = arr;
    }
  }

  updateDialogProperties() {
    this.dialogProperties.from = this.selectedPortefeuille.Libelle;
    this.dialogProperties.to = this.selectedBeneficiaire.Portefeuille[0].Libelle;
    this.dialogProperties.amount = this.transferAmount.toString();
    this.dialogProperties.afterTransfer = (this.selectedSolde - this.transferAmount).toString();
    this.dialogProperties.type = this.selectedType === 'Autre' ? this.motifFC.value :
      this.typesVirement.find(obj => obj.value === this.selectedType).viewValue;
    this.dialogProperties.date = new Date().toLocaleDateString();
  }

  openConfirmDialog(templateRef) {
    if (this.transferAmount > this.selectedSolde) {
        this.snackBar.open('Le montant du virement ne peut pas excéder le solde du portefeuille.', 'Fermer', {
          duration: 5000,
        });
    } else if (this.selectedPortefeuille.Id === this.selectedBeneficiaire.Portefeuille[0].Id) {
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

  checkConfirmState() {
    if (this.selectedBeneficiaire && Object.entries(this.selectedBeneficiaire).length > 0 &&
        Object.entries(this.selectedPortefeuille).length > 0
        && this.transferAmount !== undefined && this.transferAmount !== null && this.selectedType !== undefined
        && (this.selectedType !== 'Autre' || (this.selectedType === 'Autre' && !this.motifFC.invalid))) {
      return false;
    }
    return true;
  }

  confirmTransfer() {
    const transferDetails = {
      password: this.transferPassword,
      id: this.selectedPortefeuille.Id,
      email: this.selectedBeneficiaire.Email,
      montant: this.transferAmount,
      memo: this.selectedType === 'Autre' ? this.motifFC.value :
      this.typesVirement.find(obj => obj.value === this.selectedType).viewValue
    };
    this.apiService.makeRequest(apiUrl.submit, transferDetails).toPromise()
      .then(res => {
        setTimeout(() => {
          this.apiService.getRecord(this.apiService.portefeuilles[0].ClePub).subscribe(data => {
            this.selectedSolde = data[0].balance;
          });
        }, 1000);
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

}
