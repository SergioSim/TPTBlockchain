import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';
import { CommonUtilsService } from 'src/app/common/common-utils.service';
import { FormControl, Validators } from '@angular/forms';
import { InputErrorStateMatcher } from 'src/app/sogebank/login-sogebank/InputErrorStateMatcher';
import { timingSafeEqual } from 'crypto';


@Component({
  selector: 'app-portefeuille-brh',
  templateUrl: './portefeuille-brh.component.html',
  styleUrls: ['./portefeuille-brh.component.css']
})
export class PortefeuilleBrhComponent implements OnInit {
  dataSource: MatTableDataSource<BanqueUtilisateur>;
  contactDialogRef: any;
  parametreNom = '';
  parametreId = '';
  parametreDescription = '';
  parametreValeur = '';

  selectedPortefeuille: {
    NomCommercial: '',
    Nom: '',
    Prenom: '',
    Email:'',
    Telephone:'',
    Adresse:'',
    Code_Postal,
    Ville:'',
    Virement:'',
    isVisible:'',
    Statut
  };

  constructor(
    private service: NodeapiService,
    private commonUtilsService: CommonUtilsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  listMonnieVisible: any[];
  displayedColumns: any[];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getPortefeuilles();
    this.displayedColumns = ['Libelle','Nom','Prenom', 'Email', 'Tel','Adresse','CodePostal','Ville','Virement', 'Editer'];
  }

  getPortefeuilles() {
    this.service.makeRequest(apiUrl.allBanksUtilisateurs, {}).subscribe(
      res => {
        this.listMonnieVisible = res as BanqueUtilisateur[];
        this.dataSource = new MatTableDataSource(this.listMonnieVisible);
        this.dataSource.paginator = this.paginator;
      }
    );
  }


  openEditDialog(templateRef, monnie) {
    event.stopPropagation();
    this.selectedPortefeuille = { ...monnie };
    this.contactDialogRef = this.dialog.open(templateRef, { width: '440px' });
  }

  confirmEdiPortefeuille() {
    this.service.makeRequest(apiUrl.updateBanque, {
      banqueNew: this.selectedPortefeuille.NomCommercial,
      email:this.selectedPortefeuille.Email,
      tel:this.selectedPortefeuille.Telephone,
      isVisible:this.selectedPortefeuille.isVisible,
      statut:this.selectedPortefeuille.Statut,
      banqueOld:this.selectedPortefeuille.NomCommercial
      }).subscribe(res => {
      this.getPortefeuilles();
      this.contactDialogRef.close();
      })
    , error => {
      console.log(error);
      this.snackBar.open('Le portefeuille n\'a pas pu être mise à jour, veuillez réessayer.', 'Fermer', {
        duration: 5000,
      });
  }}

  openAddMonnieDialog(templateRef) {
    event.stopPropagation();
    this.contactDialogRef = this.dialog.open(templateRef, { width: '290px' });
  }

  confirmAddParametre() {
    var dateCreation = new Date();
    console.log(dateCreation);
    this.service.makeRequest(apiUrl.createParametre, {
      name: this.parametreNom, description: this.parametreDescription, valeur: this.parametreDescription,
      dateCreation: dateCreation
    }).
      subscribe(res => {
        this.getPortefeuilles();
        this.contactDialogRef.close();
        this.snackBar.open('Le paramère a été créé avec succès.', 'Fermer', {
          duration: 5000,
        });
      }, error => {
        this.snackBar.open('Le paramètre n\'a pas pu être créé !!, veuillez réessayer.', 'Fermer', {
          duration: 5000,
        });
      });
  }

  cancelDiologueParametre() {
    this.contactDialogRef.close();
  }

}
export interface BanqueUtilisateur {
  Nom: string;
  Prenom: string;
  Email: string;
  Telephone: number;
  Adresse:string;
  Code_Postal:string;
  Ville:string;
  Virement :string,
  isVisible:string,
  statut:string
}



/*


import { Component, OnInit } from '@angular/core';
import { NodeapiService } from 'src/app/nodeapi.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Portefeuille } from 'src/app/Portefeuille.modele';

@Component({
  selector: 'app-portefeuille-brh',
  templateUrl: './portefeuille-brh.component.html',
  styleUrls: ['./portefeuille-brh.component.css']
})
export class PortefeuilleBrhComponent implements OnInit {

    _contactList: Portefeuille ;
    contactDialogRef: any;
    p:number=1;
    selectedPortefeuille: {
      id: '',
      Nom: '',
      Portefeuille: '',
      MaxTransaction: '',
      MaxTransactionMoi: '',
      Status:''
    };

  constructor( 
    private service :NodeapiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
    ){ }

  ngOnInit() {
  }
  get ContactList() {
    return this.service.getAllContacts();
  }

  openEditCardDialog(templateRef, portefeuille) {
    event.stopPropagation();
    this.selectedPortefeuille = {...portefeuille};
    this.contactDialogRef = this.dialog.open(templateRef, { width: '330px' });
  }
  cancelEditBanque() {
    this.contactDialogRef.close();
  }

  confirmEditPortefeuille(contact){
    this.service.editContact(contact);
    console.log(contact.FirstName);
    this.contactDialogRef.close();     
    this.snackBar.open('Le portefeuille '+ contact.Nom +'a bien été modifié', 'Fermer', { duration: 5000,});
  }

}
*/