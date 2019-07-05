import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar, MatPaginator, MatTableDataSource } from '@angular/material';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';


@Component({
  selector: 'app-table-monnie-electronique',
  templateUrl: './table-monnie-electronique.component.html',
  styleUrls: ['./table-monnie-electronique.component.css']
})
export class TableMonnieElectroniqueComponent implements OnInit {
  dataSource: MatTableDataSource<Monnie>;
  contactDialogRef: any;
  p: number = 1;
  q: number = 1;
  monnieOld = "";
  monnieNom = "";
  monnieUnite = "";
  selectedMonnie: {
    Id: '';
    Nom: '',
    Unite: ''
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
    this.service.makeRequest(apiUrl.allMonnies, { type: "electronique" }).
      subscribe(res => {
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

  openEditDialog(templateRef, monnie) {
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
        this.snackBar.open('La monnie '+ this.selectedMonnie.Nom + ' n\'a pas été modifié.', 'Fermer', { duration: 5000, });
      });
  }


  openAddMonnieDialog(templateRef) {
    event.stopPropagation();
    this.contactDialogRef = this.dialog.open(templateRef, { width: '350px' });
  }

  confirmAddMonnie() {
    this.service.makeRequest(apiUrl.createMonnie, { name: this.monnieNom, unite: this.monnieUnite, type: "electronique" }).
      subscribe(res => {
        this.getMonnieVisible();
        this.contactDialogRef.close();
        this.snackBar.open('Vous avez créé une nouvelle monnie éléctronique.', 'Fermer', {
          duration: 5000,
        });
      }, error => {
        this.snackBar.open('La nouvelle monnie éléctronique n\'a pas été créé.', 'Fermer', { duration: 5000, });
        console.log(error);
      });
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
