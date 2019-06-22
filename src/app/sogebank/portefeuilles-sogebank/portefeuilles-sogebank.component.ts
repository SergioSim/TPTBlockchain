import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { faPen, faPlusCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CommonUtilsService } from 'src/app/common/common-utils.service';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';

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
  newWalletPassword: number;
  ye = true;
  selectedPortefeuille: {
    Id: '',
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
  }

  initData(self) {
    if (self) {
      self.portefeuilles = self.apiService.portefeuilles;
      self.countTotals();
    } else {
      this.portefeuilles = this.apiService.portefeuilles;
      this.countTotals();
    }
  }

  countTotals() {
    let solde = 0;
    let activite = 0;
    this.portefeuilles.forEach( portefeuille => {
      this.totalWallets++;
      solde += portefeuille.Solde ? this.commonUtilsService.currencyStringtoNumber(portefeuille.Solde) : 0;
    });
    this.totalSolde = this.commonUtilsService.numberToCurrencyString(solde);
    this.totalActivite = this.commonUtilsService.numberToCurrencyString(
      this.commonUtilsService.currencyStringtoNumber(this.sogebankService.totalDebit) +
      this.commonUtilsService.currencyStringtoNumber(this.sogebankService.totalCredit));
  }

  getPortefeuilles() {
    this.apiService.makeRequest(apiUrl.portefeuillesByUserEmail, {}).toPromise()
      .then(res => {
        this.apiService.portefeuilles = res;
        this.portefeuilles = res;
        this.sogebankService.initPortfeuillesData(this.initData, this);
        this.portefeuilles.forEach(carte => {
          // Get recent activity for each wallet
        });

        this.apiService.portefeuilles = this.portefeuilles;
        this.countTotals();
      });
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
    const newWalletdDetails = {
      libelle: this.newWalletlibelle,
      password: this.newWalletPassword
    };
    this.apiService.makeRequest(apiUrl.createPortefeuille, newWalletdDetails).toPromise()
      .then(res => {
        this.getPortefeuilles();
        this.NewWalletDialogRef.close();
        this.snackBar.open('Le portefeuille "' + this.newWalletlibelle + '" à bien été créé.', 'Fermer', {
          duration: 5000,
        });
      }, error => {
        this.snackBar.open('La création du portefeuille n\'a pas pu s\'effectué, assurez-vous d\'avoir un solde'
        + ' suffisant et que votre mot de passe soit correct avant de réessayer.', 'Fermer', {
          duration: 5000,
        });
      });
  }

  openEditWalletDialog(templateRef, portefeuille) {
    event.stopPropagation();
    this.selectedPortefeuille = {...portefeuille};
    this.editDialogRef = this.dialog.open(templateRef, { width: '400px' });
  }

  confirmWalletEdit() {
    const editPortefeuilleDetails = {
      libelle: this.selectedPortefeuille.Libelle,
      id: this.selectedPortefeuille.Id
    };
    this.apiService.makeRequest(apiUrl.updatePortefeuilleLibelle, editPortefeuilleDetails).toPromise()
      .then(res => {
        this.getPortefeuilles();
        this.editDialogRef.close();
        this.snackBar.open(this.selectedPortefeuille.Libelle + '" à bien été mis à jour.', 'Fermer', {
          duration: 5000,
        });
      }, error => {
        this.snackBar.open('Le portefeuille n\'a pas pu être mise à jour, veuillez réessayer.', 'Fermer', {
          duration: 5000,
        });
      });
  }

  cancelWalletEdit() {
    this.editDialogRef.close();
  }

}


