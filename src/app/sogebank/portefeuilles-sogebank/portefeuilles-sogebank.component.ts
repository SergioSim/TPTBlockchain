import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { faPen, faPlusCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CommonUtilsService } from 'src/app/common/common-utils.service';

@Component({
  selector: 'app-portefeuilles-sogebank',
  templateUrl: './portefeuilles-sogebank.component.html',
  styleUrls: ['./portefeuilles-sogebank.component.css']
})
export class PortefeuillesSogebankComponent implements OnInit {
  QRCode = require('qrcode');
  faPen = faPen;
  faPlusCircle = faPlusCircle;
  faExclamationTriangle = faExclamationTriangle;
  portefeuilles: any[];
  totalWallets = 0;
  totalSolde = '0';
  totalActivite = '0';
  QRcodeDialogRef: any;
  NewWalletDialogRef: any;
  selectedPortefeuille: {};
  newWalletlibelle = '';
  newWalletTransferAmount: number;

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private commonUtilsService: CommonUtilsService,
    private titleService: Title,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Mes portefeuilles - Sogebank');

    this.portefeuilles = this.sogebankService.getUserWallets();

    if (this.portefeuilles.length > 0) {
      this.countTotals();
    }
  }

  countTotals() {
    let solde = 0;
    let activite = 0;
    this.portefeuilles.forEach( portefeuille => {
      this.totalWallets++;
      solde += this.commonUtilsService.currencyStringtoNumber(portefeuille.solde);
      activite += this.commonUtilsService.currencyStringtoNumber(portefeuille.activite);
    });
    this.totalSolde = this.commonUtilsService.numberToCurrencyString(solde);
    this.totalActivite = this.commonUtilsService.numberToCurrencyString(activite);
  }

  openQRcodeDialog(templateRef, portefeuille) {
    this.selectedPortefeuille = portefeuille;
    this.QRcodeDialogRef = this.dialog.open(templateRef, { width: '350px' });
    this.QRCode.toCanvas(document.getElementById('QRcode-canvas'), String(this.selectedPortefeuille['id']),
    { errorCorrectionLevel: 'H' }, (err, canvas) => {
      if (err) {
        console.log(err);
      }
    });
  }

  closeQRcodeDialog() {
    this.QRcodeDialogRef.close();
  }

  openNewWalletDialog(templateRef) {
    this.NewWalletDialogRef = this.dialog.open(templateRef, { width: '400px' });
  }

  cancelWalletCreate() {
    this.NewWalletDialogRef.close();
  }

  confirmWalletCreate() {
    const initialAmount = this.newWalletTransferAmount === null ? 0 : this.newWalletTransferAmount;
    this.NewWalletDialogRef.close();
    this.snackBar.open('Le portefeuille "' + this.newWalletlibelle + '" à bien été créé avec un virement' +
    ' initial de ' + this.commonUtilsService.numberToCurrencyString(initialAmount) + '.', 'Fermer', {
      duration: 5000,
    });
  }

}


