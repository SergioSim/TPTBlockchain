import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { faPen, faTimes, faPlusCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
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
  cartes: any[];
  portefeuilles: any[];
  totalCards = 0;
  totalSolde = '0';
  totalActivite = '0';
  newCreateDialogRef: any;
  newCardSelectedWallet: {};
  newCardlibelle = '';
  editDialogRef: any;
  deleteDialogRef: any;
  selectedCarte: {
    id: '',
    libelle: '',
    creation: '',
    activite: '',
    rattachement: ''
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
    this.portefeuilles = this.apiService.portefeuilles;
    const portefeuilleIds = this.portefeuilles.map(pf => pf.Id);

    this.apiService.makeRequest(apiUrl.cardsByPortefeuilleIds, {Ids: portefeuilleIds}).toPromise()
      .then(res => {
        this.cartes = res;
        this.cartes.forEach(carte => {
          const attached = this.portefeuilles.filter(portefeuille => portefeuille.Id = carte.Portefeuille_Id);
          carte.rattachement = attached[0].Libelle;
        });

        this.apiService.cartes = this.cartes;
        this.countTotals();
      });
  }

  countTotals() {
    let activite = 0;
    let solde = 0;
    this.totalCards = 0;
    this.cartes.forEach( carte => {
      this.totalCards++;
      //activite += this.commonUtilsService.currencyStringtoNumber(carte.activite);
    });
    this.portefeuilles.forEach( portefeuille => {
      solde += this.commonUtilsService.currencyStringtoNumber(portefeuille.Solde);
    });
    this.totalActivite = this.commonUtilsService.numberToCurrencyString(activite);
    this.totalSolde = this.commonUtilsService.numberToCurrencyString(solde);
  }

  openNewCardDialog(templateRef) {
    this.newCreateDialogRef = this.dialog.open(templateRef, { width: '400px' });
  }

  cancelCardCreate() {
    this.newCreateDialogRef.close();
  }

  confirmCardCreate() {
    this.newCreateDialogRef.close();
    this.snackBar.open('La commande de la carte "' + this.newCardlibelle + '" à bien été effectuée et sera'
    + ' rattaché au portefeuile "' + this.newCardSelectedWallet['libelle'] + '".', 'Fermer', {
      duration: 5000,
    });
  }

  openEditCardDialog(templateRef, carte) {
    this.selectedCarte = {...carte};
    this.editDialogRef = this.dialog.open(templateRef, { width: '400px' });
  }

  confirmCardEdit() {
    const index = this.cartes.findIndex( carte => carte.id === this.selectedCarte.id);
    this.cartes[index].libelle = this.selectedCarte.libelle;
    this.editDialogRef.close();
  }

  cancelCardEdit() {
    this.editDialogRef.close();
  }

  openDeleteCardDialog(templateRef, carte) {
    this.selectedCarte = carte;
    this.deleteDialogRef = this.dialog.open(templateRef, { width: '400px' });
  }

  confirmCardDelete() {
    const index = this.cartes.findIndex( carte => carte.id === this.selectedCarte.id);
    this.cartes.splice(index, 1);
    this.countTotals();
    this.deleteDialogRef.close();
  }

  cancelCardDelete() {
    this.deleteDialogRef.close();
  }

}


