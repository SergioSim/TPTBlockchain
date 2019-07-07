import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar, MatTableDataSource, MatPaginator } from '@angular/material';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';

@Component({
  selector: 'app-table-monnie-physique',
  templateUrl: './table-monnie-physique.component.html',
  styleUrls: ['./table-monnie-physique.component.css']
})
export class TableMonniePhysiqueComponent implements OnInit {
  dataSource: MatTableDataSource<Monnie>;
  contactDialogRef: any;
  p: number = 1;
  q: number = 1;
  monnieOld = "";
  monnieNom = "";
  monnieUnite = "";

  selectedMonnie: {
    Id: '',
    Nom: '',
    Unite: ''
  };

  selectedPortefeuille: {
    id: '',
    Nom: '',
    Portefeuille: '',
    MaxTransaction: '',
    MaxTransactionMoi: '',
    Status: ''
  };

  constructor(
    private service: NodeapiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  listMonnieVisible: any[];
  displayedColumns: any[];


  ngOnInit() {
    this.getMonnieVisible();
    this.displayedColumns = ['DHTG', 'DHTGUnite', 'Nom', 'Unite', 'Supprimer', 'Editer'];
  }

  getMonnieVisible() {
    this.service.makeRequest(apiUrl.allMonnies, { type: "physique" }).subscribe(res => {
      this.listMonnieVisible = res as Monnie[];
      this.dataSource = new MatTableDataSource(this.listMonnieVisible);
      this.dataSource.paginator = this.paginator;
    }
    );
  }
  openDeleteDialog(templateRef, monnie) {
    event.stopPropagation();
    this.selectedMonnie = { ...monnie };
    this.contactDialogRef = this.dialog.open(templateRef, { width: '450px' });
  }

  deleteMonnie() {
    this.service.makeRequest(apiUrl.deleteMonnieElectronique, { name: this.selectedMonnie.Nom }).
      subscribe(res => {
        this.getMonnieVisible();
      }, error => {
        console.log('got an error');
        console.log(error);
      });
    this.contactDialogRef.close();
    this.snackBar.open('La banque' + this.selectedMonnie.Nom + ' a bien été supprimé.', 'Fermer', { duration: 5000, });
  }

  openEditDialog(templateRef, monnie) {
    event.stopPropagation();
    this.selectedMonnie = { ...monnie };
    this.contactDialogRef = this.dialog.open(templateRef, { width: '450px' });
  }

  openAddMonnieDialog(templateRef) {
    event.stopPropagation();
    this.contactDialogRef = this.dialog.open(templateRef, { width: '350px' });
  }


  confirmEditMonnie() {
    this.service.makeRequest(apiUrl.updateMonnie, {
      monnieNew: this.selectedMonnie.Nom,
      monnieUnite: this.selectedMonnie.Unite, monnieId: this.selectedMonnie.Id
    }).
    subscribe(res => {
      this.getMonnieVisible();
      this.contactDialogRef.close();
      this.snackBar.open('La monnie '+this.selectedMonnie.Nom+' a été modifié avec succès.', 'Fermer', {
        duration: 5000,
      });
    }, error => {
      this.snackBar.open('La monnie physique'+ this.selectedMonnie.Nom + ' n\'a pas été modifié.', 'Fermer', { duration: 5000, });
    });

  /*    subscribe(res => {
        console.log('on a recu la response:');
        this.getMonnieVisible();
      }, error => {
        console.log('got an error');
        console.log(error);
      });
    this.contactDialogRef.close();
    this.snackBar.open('La monnie éléctronique' + this.selectedMonnie.Nom + ' a bien été modifié.', 'Fermer', { duration: 5000, });
    */  }


  confirmAddMonnie() {
    this.service.makeRequest(apiUrl.createMonnie, { name: this.monnieNom, unite: this.monnieUnite, type: "physique" }).
      
    subscribe(res => {
      this.getMonnieVisible();
      this.contactDialogRef.close();
      this.snackBar.open('Vous avez créé une nouvelle monnie physique.', 'Fermer', {
        duration: 5000,
      });
    }, error => {
      this.snackBar.open('La nouvelle monnie physique n\'a pas été créé.', 'Fermer', { duration: 5000, });
      console.log(error);
    });
    
    
    
    
    /*
    
    subscribe(res => {
        console.log('on a recu la response:');
        this.getMonnieVisible();
      }, error => {
        console.log('got an error');
        console.log(error);
      });
    this.snackBar.open('La banque a bien été créé avec succès.', 'Fermer', { duration: 5000, });*/
  }
  cancelDiologueMonnie() {
    this.contactDialogRef.close();
  }

}
export interface Monnie {
  Nom: string;
  Unite: string;
  Type: number;
}
