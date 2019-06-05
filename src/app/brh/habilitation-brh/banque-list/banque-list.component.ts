import { Component,Inject,OnInit } from '@angular/core';
import { NodeapiService ,apiUrl} from 'src/app/nodeapi.service';
import { Banque } from 'src/app/banque.modele';
import { FormControl, FormGroup } from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material';

@Component({
  
  selector: 'app-banque-list',
  templateUrl: './banque-list.component.html',
  styleUrls: ['./banque-list.component.css'],
})
export class BanqueListComponent implements OnInit {

  contactDialogRef: any;

 
  constructor(
    private service :NodeapiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
    ) { }
  validBanque: {};
  dataSource: [];
  formData : Banque;
  listBanqueVisible : any [];
  listBanqueNotVisible : any [];
  listRestaur: any [];
  displayedColumns: string[];
  Form = new FormGroup({
  NomBanque : new FormControl(''),
  Email : new FormControl(''),
  Telephone : new FormControl('')
  });
  ancienBanque:''
  nouvelBanqueNom:'';
  nouvelBanqueEmail:'';
  nouvelBanqueTel:'';
  selectedBanque: {
    Nom: '',
    Email: '',
    Tel: '',
    isVisible: '',
    Statut:''
  };

  ngOnInit() {
    this.validBanque={nom:'',email:'',password:'',confirmPassword:''};
    this.refreshListBanque();
    this.getListBanqueRestaur();
    this.displayedColumns = ['Nom','Email','Telephone','Statut','Supprimer','Refuser','Valider'];
  }

  getListBanqueRestaur(){
    this.service.makeRequest(apiUrl.allBanks, {visible:false}).toPromise().then(res=>this.listBanqueNotVisible = res as Banque[]);
  }

  refreshListBanque(){
    this.service.makeRequest(apiUrl.allBanksNotValid, {visible:true}).toPromise().then(res=>this.listBanqueVisible = res as Banque[] );
  }
  
      deleteBanque(){
        this.service.makeRequest(apiUrl.updateBanque,{ banqueNew:this.selectedBanque.Nom, 
          banqueOld:this.selectedBanque.Nom, tel:this.selectedBanque.Tel, email:this.selectedBanque.Email,
          isVisible:0, statut:this.selectedBanque.Statut }).      
        subscribe( res =>{
          this.refreshListBanque();
          this.getListBanqueRestaur();
        }, error => {
            console.log('got an error');
            console.log(error);
        });
        this.contactDialogRef.close();  
        this.snackBar.open('La banque'+ this.selectedBanque.Nom+' a bien été supprimé.', 'Fermer', { duration: 5000,});
      }
      
      openAddBankDialog(templateRef){
        
        this.contactDialogRef = this.dialog.open(templateRef, {width: '270px'});
      }

      openRestaurDialog(templateRef){
   //     event.stopPropagation();
        this.contactDialogRef = this.dialog.open(templateRef, {width: '310px'});
      }

      openDeleteDialog(templateRef,banque){
        event.stopPropagation();
        this.selectedBanque={...banque};
        this.contactDialogRef = this.dialog.open(templateRef, {width: '450px'});
      }

      openEditDialog(templateRef,banque) {
        event.stopPropagation();
        this.selectedBanque={...banque};
        this.contactDialogRef = this.dialog.open(templateRef, {width: '350px'});
      }

      cancelEditBanque() {
        this.contactDialogRef.close();
      }
    

      cancelValidatBanque() {
        this.contactDialogRef.close();
      }

      confirmRestaurBanque(){
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
        this.snackBar.open('La banque a bien été restauré avec succès.', 'Fermer', { duration: 5000,});
      }

      confirmAddBanque(){

        this.service.makeRequest(apiUrl.createBank, {name:this.nouvelBanqueNom,email:this.nouvelBanqueEmail,telephone:this.nouvelBanqueTel,isVisible:1}).
        subscribe( res =>{
          console.log('on a recu la response:' );
          console.log(res);
        }, error => {
            console.log('got an error');
            console.log(error);
        });
        this.refreshListBanque();
        this.contactDialogRef.close();     
        this.snackBar.open('La banque a bien été créé avec succès.', 'Fermer', { duration: 5000,});
      }

      confirmEditBanque() {
        this.service.makeRequest(apiUrl.updateBanque,{ banqueNew:this.selectedBanque.Nom, 
          banqueOld:this.selectedBanque.Nom, tel:this.selectedBanque.Tel, email:this.selectedBanque.Email,
          isVisible:this.selectedBanque.isVisible
        }).      
        subscribe( res =>{
          console.log('on a recu la response:' );
          console.log(this.selectedBanque.isVisible)
          console.log()
          this.refreshListBanque();

        }, error => {
            console.log('got an error');
            console.log(error);
        });
        this.contactDialogRef.close();     
        this.snackBar.open('La banque'+ this.selectedBanque.Nom+' a bien été modifié.', 'Fermer', { duration: 5000,});
      }

      confirmCreateBanque(test) {

        this.service.makeRequest(apiUrl.createBankClient, {email:"99kjkhsdfde@de.ef",password:"efzonzefn",banque:"BRH"}).
        subscribe( res =>{
          console.log('on a recu la response:' );
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


