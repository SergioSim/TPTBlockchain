import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { faPen, faPlusCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CommonUtilsService } from 'src/app/common/common-utils.service';
import { NodeapiService } from 'src/app/nodeapi.service';

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
  editDialogRef: any;
  newWalletlibelle = '';
  newWalletTransferAmount: number;
  selectedPortefeuille: {
    ClePub: '',
    Libelle: '',
    Solde: '',
    Ouverture: '',
    Activite: ''
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
    this.titleService.setTitle('Mes portefeuilles - Sogebank');
    this.portefeuilles = this.apiService.portefeuilles;
    this.countTotals();
  }

  initData() {
    console.log('child init !');
  }

  countTotals() {
    let solde = 0;
    let activite = 0;
    this.portefeuilles.forEach( portefeuille => {
      this.totalWallets++;
      solde += this.commonUtilsService.currencyStringtoNumber(portefeuille.Solde);
      //activite += this.commonUtilsService.currencyStringtoNumber(portefeuille.Activite);
    });
    this.totalSolde = this.commonUtilsService.numberToCurrencyString(solde);
    this.totalActivite = this.commonUtilsService.numberToCurrencyString(activite);
  }

  formatDate(date) {
    const dateParts = date.split('-');
    const convertedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
    return convertedDate.getDate()  + '/' + (convertedDate.getMonth() + 1) + '/' + convertedDate.getFullYear();
  }

  openQRcodeDialog(templateRef, portefeuille) {
    this.selectedPortefeuille = portefeuille;
    this.QRcodeDialogRef = this.dialog.open(templateRef, { minWidth: '350px' });
    this.QRCode.toCanvas(document.getElementById('QRcode-canvas'), String(this.selectedPortefeuille['ClePub']),
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

  openEditWalletDialog(templateRef, portefeuille) {
    event.stopPropagation();
    this.selectedPortefeuille = {...portefeuille};
    this.editDialogRef = this.dialog.open(templateRef, { width: '400px' });
  }

  confirmWalletEdit() {
    const index = this.portefeuilles.findIndex( portefeuille => portefeuille.ClePub === this.selectedPortefeuille.ClePub);
    this.portefeuilles[index].Libelle = this.selectedPortefeuille.Libelle;
    this.editDialogRef.close();
  }

  cancelWalletEdit() {
    this.editDialogRef.close();
  }

}


