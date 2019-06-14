import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NodeapiService ,apiUrl} from 'src/app/nodeapi.service';


@Component({
  selector: 'app-parametres-brh',
  templateUrl: './parametres-brh.component.html',
  styleUrls: ['./parametres-brh.component.css']
})
export class ParametresBrhComponent implements OnInit {
    
    contactDialogRef: any;
    p:number=1;
    q:number=1;
    monnieOld="";
    monnieNom="";
    monnieUnite="";
    selectedParametre: {
      Id:'';
      Nom: '',
      Description: '',
      DateCreation:''
      };

  constructor( 
    private service :NodeapiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
    ){ }

    listMonnieVisible : any [];
    displayedColumns :any[];


  ngOnInit() {
    this.getParametres();
    this.displayedColumns = ['Id','Nom','Descritpion','DateCreation','Supprimer','Editer'];
  }

  getParametres(){
    this.service.makeRequest(apiUrl.allParametres , {}).toPromise().then(res=>this.listMonnieVisible = res as Paramatres[] );
  }

  openDeleteDialog(templateRef,parametre){
    event.stopPropagation();
    this.selectedParametre={...parametre};
    this.contactDialogRef = this.dialog.open(templateRef, {width: '330px'});
  }

  openEditDialog(templateRef,monnie){
    event.stopPropagation();
    this.selectedParametre={...monnie};
    this.contactDialogRef = this.dialog.open(templateRef, {width: '450px'});
  }

  deleteParametre(){
    this.service.makeRequest(apiUrl.deleteParametre,{ id:this.selectedParametre.Id}).      
    subscribe( res =>{
      this.getParametres();
    }, error => {
        console.log('got an error');
        console.log(error);
    });
    this.contactDialogRef.close();  
    this.snackBar.open('Le paramètre'+ this.selectedParametre.Nom+' a bien été supprimé.', 'Fermer', { duration: 5000,});
  }

  confirmEditMonnie() {    
    this.service.makeRequest(apiUrl.updateMonnie,{monnieNew:this.selectedParametre.Nom,
      monnieUnite:this.selectedParametre.Unite,monnieId:this.selectedParametre.Id}).   
     
    subscribe( res =>{
      console.log('on a recu la response:' );
      this.getParametres();
    }, error => {
        console.log('got an error');
        console.log(error);
    });
    this.contactDialogRef.close();     
    this.snackBar.open('La monnie éléctronique'+ this.selectedParametre.Nom+' a bien été modifié.', 'Fermer', { duration: 5000,});
   }

   
  openAddMonnieDialog(templateRef){
    event.stopPropagation();
    this.contactDialogRef = this.dialog.open(templateRef, {width: '350px'});
  }

  confirmAddMonnie(){    
    this.service.makeRequest(apiUrl.createMonnie, {name:this.monnieNom,unite:this.monnieUnite,type:"electronique"}).
    subscribe( res =>{
      console.log('on a recu la response:' );
      this.getParametres();
    }, error => {
        console.log('got an error');
        console.log(error);
    });
    this.snackBar.open('La banque a bien été créé avec succès.', 'Fermer', { duration: 5000,});
}
 
  cancelDiologueMonnie () {
    this.contactDialogRef.close();
  }

}  
  export interface Paramatres {
    Id: number;
    Nom: string;
    Description: string;
    DateCreation : string
  }
  