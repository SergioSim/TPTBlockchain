import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { faPen, faTimes, faPlusCircle, faExclamationTriangle, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { CommonUtilsService } from 'src/app/common/common-utils.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';

@Component({
  selector: 'app-cartes-sogebank',
  templateUrl: './cartes-sogebank.component.html',
  styleUrls: ['./cartes-sogebank.component.css']
})
export class CartesSogebankComponent implements OnInit {
  faPen = faPen;
  faTimes = faTimes;
  faPlusCircle = faPlusCircle;
  faExclamationTriangle = faExclamationTriangle;
  faLock = faLock;
  faLockOpen = faLockOpen;
  cartes: any[];
  portefeuilles: any[];
  totalCards = 0;
  totalSolde = '0';
  newCreateDialogRef: any;
  newCardSelectedWallet: {};
  newCardlibelle = '';
  newCardPassword: any;
  editDialogRef: any;
  deleteDialogRef: any;
  blockDialogRef: any;
  unblockDialogRef: any;
  selectedCarte: {
    Id: '',
    Libelle: '',
    Creation: '',
    Rattachement: ''
  };

  constructor(
    private apiService: NodeapiService,
    private sogebankService: SogebankService,
    private commonUtilsService: CommonUtilsService,
    private titleService: Title,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Mes cartes - Sogebank');
  }

  initData() {
    this.portefeuilles = this.apiService.portefeuilles;
    this.getCartes(null);
  }

  countTotals() {
    let solde = 0;
    this.totalCards = 0;
    this.cartes.forEach( carte => {
      this.totalCards++;
    });
    this.portefeuilles.forEach( portefeuille => {
      solde += this.commonUtilsService.currencyStringtoNumber(portefeuille.Solde);
    });
    this.totalSolde = this.commonUtilsService.numberToCurrencyString(solde);
  }

  getCartes(self) {
    if (self) {
      const portefeuilleIds = self.portefeuilles.map(pf => pf.Id);
      self.apiService.makeRequest(apiUrl.cardsByPortefeuilleIds, {Ids: portefeuilleIds}).toPromise()
        .then(res => {
          self.cartes = res;
          self.cartes.forEach(carte => {
            const attached = self.portefeuilles.filter(portefeuille => portefeuille.Id === carte.Portefeuille_Id);
            carte.rattachement = attached[0].Libelle;
          });

          self.apiService.cartes = self.cartes;
          self.countTotals();
        });
    } else {
      const portefeuilleIds = this.portefeuilles.map(pf => pf.Id);
      this.apiService.makeRequest(apiUrl.cardsByPortefeuilleIds, {Ids: portefeuilleIds}).toPromise()
        .then(res => {
          this.cartes = res;
          this.cartes.forEach(carte => {
            const attached = this.portefeuilles.filter(portefeuille => portefeuille.Id === carte.Portefeuille_Id);
            carte.rattachement = attached[0].Libelle;
          });

          this.apiService.cartes = this.cartes;
          this.countTotals();
        });
    }
  }

  openNewCardDialog(templateRef) {
    this.newCreateDialogRef = this.dialog.open(templateRef, { width: '400px' });
  }

  cancelCardCreate() {
    this.newCreateDialogRef.close();
  }

  confirmCardCreate() {
    const newCardDetails = {
      libelle: this.newCardlibelle,
      portefeuille_id: this.newCardSelectedWallet['Id']
    };
    this.apiService.makeRequest(apiUrl.createCarte, newCardDetails).toPromise()
      .then(res => {
        this.sogebankService.transferToSogebank(this.apiService.portefeuilles[0].Id, this.newCardPassword,
          150, 'Commande nouvelle carte', this.getCartes, this);
        this.newCreateDialogRef.close();
        this.snackBar.open('La commande de la carte "' + this.newCardlibelle + '" à bien été effectuée et sera'
        + ' rattaché au portefeuile "' + this.newCardSelectedWallet['Libelle'] + '".', 'Fermer', {
          duration: 5000,
        });
      }, error => {
        this.snackBar.open('La commande de la carte ne s\'est pas effectué, assurez-vous d\'avoir un solde'
        + ' suffisant avant de réessayer.', 'Fermer', {
          duration: 5000,
        });
      });
  }

  openEditCardDialog(templateRef, carte) {
    this.selectedCarte = {...carte};
    this.editDialogRef = this.dialog.open(templateRef, { width: '400px' });
  }

  confirmCardEdit() {
    const editCardDetails = {
      libelle: this.selectedCarte.Libelle,
      id: this.selectedCarte.Id
    };
    this.apiService.makeRequest(apiUrl.updateCarte, editCardDetails).toPromise()
      .then(res => {
        this.getCartes(null);
        this.editDialogRef.close();
        this.snackBar.open(this.selectedCarte.Libelle + ' à bien été mis à jour.', 'Fermer', {
          duration: 5000,
        });
      }, error => {
        this.snackBar.open('La carte n\'a pas pu être mise à jour, veuillez réessayer.', 'Fermer', {
          duration: 5000,
        });
      });
  }

  cancelCardEdit() {
    this.editDialogRef.close();
  }

  openDeleteCardDialog(templateRef, carte) {
    this.selectedCarte = carte;
    this.deleteDialogRef = this.dialog.open(templateRef, { width: '400px' });
  }

  confirmCardDelete() {
    const deleteCardDetails = {
      libelle: this.selectedCarte.Libelle,
      id: this.selectedCarte.Id
    };
    this.apiService.makeRequest(apiUrl.deleteCarte, {id: deleteCardDetails.id}).toPromise()
      .then(res => {
        this.getCartes(null);
        this.deleteDialogRef.close();
        this.snackBar.open(deleteCardDetails.libelle + ' à bien été supprimé.', 'Fermer', {
          duration: 5000,
        });
      }, error => {
        this.snackBar.open('La carte n\'a pas pu être supprimée, veuillez réessayer.', 'Fermer', {
          duration: 5000,
        });
      });
  }

  cancelCardDelete() {
    this.deleteDialogRef.close();
  }

  openBlockCardDialog(templateRef, carte) {
    this.selectedCarte = carte;
    this.blockDialogRef = this.dialog.open(templateRef, { width: '400px' });
  }

  confirmCardBlock() {
    const blockCardDetails = {
      libelle: this.selectedCarte.Libelle,
      id: this.selectedCarte.Id
    };
    this.apiService.makeRequest(apiUrl.blockCarte, {id: blockCardDetails.id}).toPromise()
      .then(res => {
        this.getCartes(null);
        this.blockDialogRef.close();
        this.snackBar.open(blockCardDetails.libelle + ' à bien été blocké.', 'Fermer', {
          duration: 5000,
        });
      }, error => {
        this.snackBar.open('La carte n\'a pas pu être bloquée, veuillez réessayer.', 'Fermer', {
          duration: 5000,
        });
      });
  }

  cancelCardBlock() {
    this.blockDialogRef.close();
  }

  openUnblockCardDialog(templateRef, carte) {
    this.selectedCarte = carte;
    this.unblockDialogRef = this.dialog.open(templateRef, { width: '400px' });
  }

  confirmCardUnblock() {
    const unblockCardDetails = {
      libelle: this.selectedCarte.Libelle,
      id: this.selectedCarte.Id
    };
    this.apiService.makeRequest(apiUrl.unblockCarte, {id: unblockCardDetails.id}).toPromise()
      .then(res => {
        this.getCartes(null);
        this.unblockDialogRef.close();
        this.snackBar.open(unblockCardDetails.libelle + ' à bien été débloqué.', 'Fermer', {
          duration: 5000,
        });
      }, error => {
        this.snackBar.open('La carte n\'a pas pu être débloquée, veuillez réessayer.', 'Fermer', {
          duration: 5000,
        });
      });
  }

  cancelCardUnblock() {
    this.unblockDialogRef.close();
  }

}


