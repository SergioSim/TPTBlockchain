  import { Component, OnInit } from '@angular/core';
  import { MatDialog, MatSnackBar } from '@angular/material';
  import { NodeapiService ,apiUrl} from 'src/app/nodeapi.service';

  
  @Component({
    selector: 'app-parametre-brh',
    templateUrl: './parametre-brh.component.html',
    styleUrls: ['./parametre-brh.component.css']
  })
  export class ParametreBrhComponent implements OnInit {
      
      contactDialogRef: any;
      p:number=1;
      q:number=1;
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

      listMonnieVisible : any [];
      displayedColumns :any[];

  
    ngOnInit() {
   //   this.getMonnieVisible();
 //     this.displayedColumns = ['DHTG','DHTGUnite','Nom','Unite','Supprimer'];
    }

    getMonnieVisible(){
   //   this.service.makeRequest(apiUrl.allMonnies , {type:"electronique"}).toPromise().then(res=>this.listMonnieVisible = res as Monnie[] );
    }
    get ContactList() {
      return this.service.getAllMonnieElectronique();
    }
    get ContactListPhysique() {
      return this.service.getAllMonniePhysique();
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
