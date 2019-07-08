import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';
import { Banque } from 'src/app/banque.modele';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatSnackBar, MatTableDataSource, MatPaginator } from '@angular/material';
import { SogebankService } from 'src/app/sogebank/sogebank.service';
import * as jsPDF from 'jspdf'

@Component({

  selector: 'app-banque-list',
  templateUrl: './banque-list.component.html',
  styleUrls: ['./banque-list.component.css'],
})
export class BanqueListComponent implements OnInit {
  dataSource: MatTableDataSource<Banque>;
  data: MatTableDataSource<Banque>;
  dataS: MatTableDataSource<Banque>;
  contactDialogRef: any;


  constructor(
    private service: NodeapiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sogebankService: SogebankService
  ) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;

  validBanque: {};
  formData: Banque;
  listBanqueVisible: any[];
  listBanqueNotVisible: any[];
  listBanqueValid: any[];
  listRestaur: any[];
  displayedColumns: string[];
  clientType = this.sogebankService.isNewParticulier === (true || null || undefined) ? 1 : 2;

  Form = new FormGroup({
    NomBanque: new FormControl(''),
    Email: new FormControl(''),
    Telephone: new FormControl('')
  });
  ancienBanque: ''
  nouvelBanqueNom: '';
  nouvelBanqueEmail: '';
  nouvelBanqueTel: '';
  selectedBanque: {
    NomCommercial: '',
    Email: '',
    Telephone: '',
    isVisible: '',
    Statut: ''
  };

  ngOnInit() {
    this.validBanque = { nom: '', email: '', password: '', confirmPassword: '' };
    this.refreshListBanque();
    //  this.getListBanqueRestaur();
    this.displayedColumns = ['Nom', 'Email', 'Telephone', 'Statut', 'Document', 'Supprimer', 'Refuser', 'Valider'];
  }
  /*
    getListBanqueRestaur() {
      this.service.makeRequest(apiUrl.allBanks, { visible: false }).
      subscribe(res => {
        this.listBanqueNotVisible = res as Banque[];
        this.dataS = new MatTableDataSource(this.listBanqueNotVisible);
        this.dataS.paginator = this.paginator;
      }
      );
    }
   */
  downloadPI() {
    console.log('download pdf ..');
    const doc = new jsPDF();
    doc.save('pièce_identité.pdf');
  }
  downloadJD() {
    console.log('download pdf ..');
    const doc = new jsPDF();
    doc.save('justificatif_de_domicil.pdf');
  }
  downloadAL() {
    console.log('download pdf ..');
    const doc = new jsPDF();
    doc.save('annonce_legale.pdf');
  }
  openDownloadDialog(templateRef, portefeuille) {
    event.stopPropagation();
    this.contactDialogRef = this.dialog.open(templateRef, { width: '250px' });
  }

  refreshListBanque() {
    this.service.makeRequest(apiUrl.allBanksNotValid, { visible: true }).
      subscribe(res => {
        this.listBanqueVisible = res as Banque[];
        this.dataSource = new MatTableDataSource(this.listBanqueVisible);
        this.dataSource.paginator = this.paginator;
      }
      );
  }

  deleteBanque() {
    this.service.makeRequest(apiUrl.updateBanque, {
      banqueNew: this.selectedBanque.NomCommercial,
      banqueOld: this.selectedBanque.NomCommercial, telephone: this.selectedBanque.Telephone, email: this.selectedBanque.Email,
      isVisible: 0, statut: this.selectedBanque.Statut
    }).
      subscribe(res => {
        this.refreshListBanque();
        //   this.getListBanqueRestaur();
      }, error => {
        console.log('got an error');
        console.log(error);
      });
    this.contactDialogRef.close();
    this.snackBar.open('La banque' + this.selectedBanque.NomCommercial + ' a bien été supprimé.', 'Fermer', { duration: 5000, });
  }

  refuseBanque() {
    this.service.makeRequest(apiUrl.updateBanque, {
      banqueNew: this.selectedBanque.NomCommercial,
      banqueOld: this.selectedBanque.NomCommercial, telephone: this.selectedBanque.Telephone, email: this.selectedBanque.Email,
      isVisible: 1, statut: "refusé"
    }).
      subscribe(res => {
        this.refreshListBanque();
        //    this.getListBanqueRestaur();
      }, error => {
        console.log('got an error');
        console.log(error);
      });
    this.contactDialogRef.close();
    this.snackBar.open('La banque' + this.selectedBanque.NomCommercial + ' a bien été supprimé.', 'Fermer', { duration: 5000, });

  }

  refreshListBanqueValid() {
    this.service.makeRequest(apiUrl.allBanksValid, {}).
      subscribe(res => {
        this.listBanqueValid = res as Banque[];
        this.data = new MatTableDataSource(this.listBanqueValid);
        this.data.paginator = this.paginator;
      }
      );
  }

  validateBanque() {
    this.service.makeRequest(apiUrl.updateBanque, {
      banqueNew: this.selectedBanque.NomCommercial, banqueOld: this.selectedBanque.NomCommercial, telephone: this.selectedBanque.Telephone,
      email: this.selectedBanque.Email, isVisible: 1, statut: "validé"
    }).subscribe(res => {
      this.refreshListBanque();
      this.refreshListBanqueValid();
      this.service.makeRequest(apiUrl.unBlockBanque, { email: this.selectedBanque.Email }).
        subscribe(res => {
          console.log('Yes');
          this.sendEmailToBankClient();
        }, error => {
          console.log('got an error 1');
          console.log(this.selectedBanque.Email);

          console.log(error);
        });
    }, error => {
      console.log('got an error 2');
      console.log(error);
    });
    this.contactDialogRef.close();
    this.snackBar.open('La banque' + this.selectedBanque.NomCommercial + ' a bien été validé.', 'Fermer', { duration: 5000, });
  }

  sendEmailToBankClient(): any {
    this.service.makeRequest(apiUrl.clients, { banque: this.selectedBanque.NomCommercial }).subscribe(
      lesClientsBancaires => {
        const leClientBanque = lesClientsBancaires.find(client => client.Email === this.selectedBanque.Email);
        if (leClientBanque) {
          this.service.makeRequest(apiUrl.sendDocumentsValidatedEmailToClient, {
            email: this.selectedBanque.Email,
            prenom: leClientBanque.Prenom,
            nom: leClientBanque.Nom,
            banque: this.selectedBanque.NomCommercial,
            isValidated: true
          }).subscribe(
            resutat => {
              this.snackBar.open('Les Documents de la Banque ' + this.selectedBanque.NomCommercial +
                ' sont validees avec succes! \nUn Email de notification est envoye!', 'Fermer', {
                  duration: 5000,
                  panelClass: ['succes-snackbar']
                });
            }, error => {
              this.snackBar.open('Un probleme lors de l\'envoi du email a la banque est survenu!', 'Fermer', {
                duration: 5000,
                panelClass: ['alert-snackbar']
              });
            }
          );
        } else {
          console.log('Banque introuvable...');
          this.snackBar.open('Un probleme lors de la recherche du client bancaire est survenu!', 'Fermer', {
            duration: 5000,
            panelClass: ['alert-snackbar']
          });
        }
      }, err => {
        this.snackBar.open('Un probleme lors de la recuperation du client bancaire est survenu!', 'Fermer', {
          duration: 5000,
          panelClass: ['alert-snackbar']
        });
      });
  }

  openAddBankDialog(templateRef) {

    this.contactDialogRef = this.dialog.open(templateRef, { width: '270px' });
  }

  openRestaurDialog(templateRef) {
    //     event.stopPropagation();
    this.contactDialogRef = this.dialog.open(templateRef, { width: '310px' });
  }

  openDeleteDialog(templateRef, banque) {
    event.stopPropagation();
    this.selectedBanque = { ...banque };
    this.contactDialogRef = this.dialog.open(templateRef, { width: '450px' });
  }

  openValidateDialog(templateRef, banque) {
    event.stopPropagation();
    this.selectedBanque = { ...banque };
    this.contactDialogRef = this.dialog.open(templateRef, { width: '450px' });
  }

  openEditDialog(templateRef, banque) {
    event.stopPropagation();
    this.selectedBanque = { ...banque };
    this.contactDialogRef = this.dialog.open(templateRef, { width: '350px' });
  }

  cancelEditBanque() {
    this.contactDialogRef.close();
  }


  cancelValidatBanque() {
    this.contactDialogRef.close();
  }

  confirmRestaurBanque() {
/*        this.service.makeRequest(apiUrl.updateBanque,{ banqueNew:this.selectedBanque.Nom, 
          banqueOld:this.selectedBanque.Nom, tel:this.selectedBanque.Tel, email:this.selectedBanque.Email,
          isVisible:1 }).      
        subscribe( res =>{
          this.refreshListBanque();
          this.refreshListBanque(); 
        }, error => {
            console.log('got an error');
            console.log(error);
        });
     */   this.contactDialogRef.close();
    this.snackBar.open('La banque a bien été restauré avec succès.', 'Fermer', { duration: 5000, });
  }

  confirmAddBanque() {

    this.service.makeRequest(apiUrl.createBank, { name: this.nouvelBanqueNom, email: this.nouvelBanqueEmail, telephone: this.nouvelBanqueTel, isVisible: 1 }).
      subscribe(res => {
        console.log('on a recu la response:');
        console.log(res);
      }, error => {
        console.log('got an error');
        console.log(error);
      });
    this.refreshListBanque();
    this.contactDialogRef.close();
    this.snackBar.open('La banque a bien été créé avec succès.', 'Fermer', { duration: 5000, });
  }

  confirmEditBanque() {
    this.service.makeRequest(apiUrl.updateBanque, {
      banqueNew: this.selectedBanque.NomCommercial,
      banqueOld: this.selectedBanque.NomCommercial, telephone: this.selectedBanque.Telephone, email: this.selectedBanque.Email,
      isVisible: this.selectedBanque.isVisible
    }).
      subscribe(res => {
        console.log('on a recu la response:');
        console.log(this.selectedBanque.isVisible)
        console.log()
        this.refreshListBanque();

      }, error => {
        console.log('got an error');
        console.log(error);
      });
    this.contactDialogRef.close();
    this.snackBar.open('La banque' + this.selectedBanque.NomCommercial + ' a bien été modifié.', 'Fermer', { duration: 5000, });
  }

  confirmCreateBanque(test) {

    this.service.makeRequest(apiUrl.createBankClient, { email: "99kjkhsdfde@de.ef", password: "efzonzefn", banque: "BRH" }).
      subscribe(res => {
        console.log('on a recu la response:');
        console.log(res);
      }, error => {
        console.log('got an error');
        console.log(error);
      });


    this.contactDialogRef.close();

    this.snackBar.open('Le portefeuille de la banque ' + test.Nom
      + ' a bien été créé.', 'Fermer', {
        duration: 5000,
      });
  }

}


