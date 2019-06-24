import { Component, OnInit } from '@angular/core';
import { apiUrl, NodeapiService } from 'src/app/nodeapi.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CommonUtilsService } from 'src/app/common/common-utils.service';
import { Banque } from 'src/app/banque.modele';
import { ThrowStmt } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Portefeuille } from 'src/app/Portefeuille.modele';

@Component({
  selector: 'app-portefeuille-principal-brh',
  templateUrl: './portefeuille-principal-brh.component.html',
  styleUrls: ['./portefeuille-principal-brh.component.css']
})
export class PortefeuillePrincipalBrhComponent implements OnInit {

  contactDialogRef: any;
  transferAmount: number;
  confirmDialogRef: any;
  listBanqueValid: any;
  solde: number;
  soldeApres: number;
  quantite: '';
  password: '';
  banqueNomSelected:'';
  portefeuillePrincipale:string;
  soldeTotal:number;

  
 

  constructor(
    private service: NodeapiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private commonUtilsService: CommonUtilsService
  ) { }

  ngOnInit() {
    this.getSoldeBRH();
    this.getListBanqueValid();
    this.portefeuillePrincipale='Portefeuille principale BRH';

  }

  getListBanqueValid() {
    this.service.makeRequest(apiUrl.allBanksValid, {}).
      subscribe(res => {
        this.listBanqueValid = res as Banque[];
      }
    );
  }

  getSoldeBRH() {

    if (this.service.portefeuilles && this.service.portefeuilles.length > 0) {
      for (const portefeuille of this.service.portefeuilles) {
        this.service.getRecord(portefeuille.ClePub).subscribe(
          data => {
            if (data[0] && data[0].balance) {
              portefeuille.Solde = this.commonUtilsService.numberToCurrencyString(data[0].balance);
              this.solde = portefeuille.Solde;
              this.soldeTotal=data[0].balance;
            }
          },
          error => {
            console.log(error);
          })
      }
    }
  }

  openAddBankDialog(templateRef) {

    this.contactDialogRef = this.dialog.open(templateRef, { width: '250px' });
  }

  cancelAddMonnie() {
    this.contactDialogRef.close();
  }

  confirmAddMonnie(contact) {
    this.service.makeRequest(apiUrl.issueDHTG, { password: this.password, id: 48, montant: this.quantite }).
      subscribe(res => {
        console.log('yes');
        this.getSoldeBRH();

      }, error => {
        console.log('got an error');
        console.log(error);
      });
    this.contactDialogRef.close();
    this.snackBar.open('La banque wwwww a bien été supprimé.', 'Fermer', { duration: 5000, });
  }

  openConfirmDialog(templateRef) {

    this.confirmDialogRef = this.dialog.open(templateRef);
    this.confirmDialogRef.afterClosed().subscribe(result => {

    });
  }
  checkConfirmState() {
    if (this.transferAmount !== undefined && this.transferAmount !== null) {
      return false;
    }
    return true;
  }

  changeBanque(value) {
    this.banqueNomSelected=value;
    console.log("nadir"+value);
}
  confirmTransferTo() {

   this.service.makeRequest(apiUrl.transferTo,{id:48,password:'aPassword',clePubDestinataire:'XfXCkMYwNK1UhbR5isbxvynAKocaRzMJ3m'
   ,montant:this.transferAmount,memo:'virement'}
   ).subscribe(
      data => {
        console.log("oui");
        console.log("oui"+this.banqueNomSelected);
        this.getSoldeBRH();
      },
      error => {
        console.log(error);
      })
  

    this.confirmDialogRef.close();

    this.snackBar.open('Le virement de ' + this.transferAmount + ' DHTG vers '
      + this.banqueNomSelected+ ' à bien été effectué avec succès.', 'Fermer', {
        duration: 5000,
      });
  }

  cancelTransfer() {
    this.confirmDialogRef.close();
  }
}

