import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { faPen, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material';
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
  portefeuilles: any[];
  totalWallets = 0;
  totalSolde = '0';
  totalActivite = '0';
  QRcodeDialogRef: any;
  selectedPortefeuille: {};

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private commonUtilsService: CommonUtilsService,
    private titleService: Title,
    private dialog: MatDialog
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

}


