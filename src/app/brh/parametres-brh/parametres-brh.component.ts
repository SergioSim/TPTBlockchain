import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';


@Component({
  selector: 'app-parametres-brh',
  templateUrl: './parametres-brh.component.html',
  styleUrls: ['./parametres-brh.component.css']
})
export class ParametresBrhComponent implements OnInit {
  dataSource: MatTableDataSource<Paramatres>;
  contactDialogRef: any;
  parametreNom = '';
  parametreId = '';
  parametreDescription = '';
  parametreValeur = '';

  selectedParametre: {
    Id: '';
    Nom: '',
    Description: '',
    Valeur: '',
    DateCreation: ''
  };

  constructor(
    private service: NodeapiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  listMonnieVisible: any[];
  displayedColumns: any[];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getParametres();
    this.displayedColumns = ['Nom', 'Descritpion', 'Valeur', 'DateCreation', 'Supprimer', 'Editer'];
  }

  getParametres() {
    this.service.makeRequest(apiUrl.allParametres, {}).subscribe(
      res => {
        this.listMonnieVisible = res as Paramatres[];
        this.dataSource = new MatTableDataSource(this.listMonnieVisible);
        this.dataSource.paginator = this.paginator;

      }
    );
  }

  openDeleteDialog(templateRef, parametre) {
    event.stopPropagation();
    this.selectedParametre = { ...parametre };
    this.contactDialogRef = this.dialog.open(templateRef, { width: '330px' });
  }

  openEditDialog(templateRef, monnie) {
    event.stopPropagation();
    this.selectedParametre = { ...monnie };
    this.contactDialogRef = this.dialog.open(templateRef, { width: '300px' });
  }

  deleteParametre() {
    this.service.makeRequest(apiUrl.deleteParametre, { id: this.selectedParametre.Id }).
      subscribe(res => {
        this.getParametres();
      }, error => {
        console.log('got an error');
        console.log(error);
      });
    this.contactDialogRef.close();
    this.snackBar.open('Le paramètre' + this.selectedParametre.Nom + ' a bien été supprimé.', 'Fermer', { duration: 5000, });
  }

  confirmEditParametre() {
    this.service.makeRequest(apiUrl.updateParametre, {
      parametreId: this.selectedParametre.Id, parametreNom: this.selectedParametre.Nom,
      parametreDescription: this.selectedParametre.Description,
      parametreValeur: this.selectedParametre.Valeur
    }).subscribe(res => {
      this.getParametres();
      this.contactDialogRef.close();
      this.snackBar.open(this.selectedParametre.Nom + '" à bien été mis à jour.', 'Fermer', {
        duration: 5000,
      });
    }, error => {
      this.snackBar.open('Le paramètre n\'a pas pu être mise à jour, veuillez réessayer.', 'Fermer', {
        duration: 5000,
      });
    });
  }

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
        this.getParametres();
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
export interface Paramatres {
  Id: number;
  Nom: string;
  Description: string;
  DateCreation: string;
}
