import { Component, OnInit } from '@angular/core';
import { NodeapiService } from 'src/app/nodeapi.service';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-portefeuille-principal-brh',
  templateUrl: './portefeuille-principal-brh.component.html',
  styleUrls: ['./portefeuille-principal-brh.component.css']
})
export class PortefeuillePrincipalBrhComponent implements OnInit {

  contactDialogRef: any;
  typeMonnie:'';
  quantitte:'';
  transferAmount: number;
  confirmDialogRef: any;

 
  constructor(
    private service :NodeapiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
  }

  openAddBankDialog(templateRef){
        
    this.contactDialogRef = this.dialog.open(templateRef, {width: '250px'});
  }

  cancelAddMonnie() {
    this.contactDialogRef.close();
  }

  confirmAddMonnie(contact){
   
    this.contactDialogRef.close();     
  }

  openConfirmDialog(templateRef) {

      this.confirmDialogRef = this.dialog.open(templateRef);
      this.confirmDialogRef.afterClosed().subscribe(result => {

      });
    }
    checkConfirmState() {
      if ( this.transferAmount !== undefined && this.transferAmount !== null) {
        return false;
      }
      return true;
    }

    confirmTransfer() {
      this.confirmDialogRef.close();
  
      this.snackBar.open('Le virement de ' + this.transferAmount + ' DHTG vers '
        +  + ' à bien été effectué.', 'Fermer', {
        duration: 5000,
      });
    }
  
    cancelTransfer() {
      this.confirmDialogRef.close();
    }
  }

