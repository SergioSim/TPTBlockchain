import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { faPen, faTimes, faPlusCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { CommonUtilsService } from 'src/app/common/common-utils.service';
import { MatSnackBar, MatDialog } from '@angular/material';

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
  totalSolde = '14 636 DHTG';
  totalActivite = '0';
  newCreateDialogRef: any;
  newCardSelectedWallet: {};
  newCardlibelle = '';

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private commonUtilsService: CommonUtilsService,
    private titleService: Title,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Mes cartes - Sogebank');

    this.cartes = this.sogebankService.getUserCards();
    this.portefeuilles = this.sogebankService.getUserWallets();

    if (this.cartes.length > 0) {
      this.countTotals();
    }
  }

  countTotals() {
    let activite = 0;
    this.cartes.forEach( carte => {
      this.totalCards++;
      activite += this.commonUtilsService.currencyStringtoNumber(carte.activite);
    });
    this.totalActivite = this.commonUtilsService.numberToCurrencyString(activite);
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

}


