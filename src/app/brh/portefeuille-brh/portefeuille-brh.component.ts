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

  openEditCardDialog(templateRef, carte) {
    this.contactDialogRef = this.dialog.open(templateRef, { width: '300px' });
  }
  cancelEditBanque() {
    this.contactDialogRef.close();
  }

  confirmEditPortefeuille(contact){
    this.service.editContact(contact);
    console.log(contact.FirstName);
    this.contactDialogRef.close();     
    this.snackBar.open('Le portefeuille '+ contact.Email +'a bien été modifié', 'Fermer', { duration: 5000,});
  
  }

}
