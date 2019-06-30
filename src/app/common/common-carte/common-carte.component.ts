import { Component, OnInit, Input } from '@angular/core';
import { Portefeuille } from 'src/app/brh/clients-banque-prive/clients-banque-prive.component';
import { faPen, faTimes, faPlusCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { CommonUtilsService } from '../common-utils.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';

@Component({
  selector: 'app-common-carte',
  templateUrl: './common-carte.component.html',
  styleUrls: ['./common-carte.component.css']
})
export class CommonCarteComponent implements OnInit {

  @Input() card: Card;
  editDialogRef: any;
  deleteDialogRef: any;
  faPen = faPen;
  faTimes = faTimes;
  faPlusCircle = faPlusCircle;
  faExclamationTriangle = faExclamationTriangle;

  constructor(
    private apiService: NodeapiService,
    public commonUtilsService: CommonUtilsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit() {

  }

  openEditCardDialog(templateRef) {
    this.editDialogRef = this.dialog.open(templateRef, { width: '400px' });
  }

  openDeleteCardDialog(templateRef) {
    this.deleteDialogRef = this.dialog.open(templateRef, { width: '400px' });
  }

  confirmCardEdit() {
    const editCardDetails = {
      libelle: this.card.Libelle,
      id: this.card.Id
    };
    this.apiService.makeRequest(apiUrl.updateCarte, editCardDetails).toPromise()
      .then(res => {
        //this.getCartes(); EMMIT ? 
        this.editDialogRef.close();
        this.snackBar.open(this.card.Libelle + '" à bien été mis à jour.', 'Fermer', {
          duration: 5000,
        });
      }, error => {
        this.snackBar.open('La carte n\'a pas pu être mise à jour, veuillez réessayer.', 'Fermer', {
          duration: 5000,
        });
      });
  }

  confirmCardDelete() {
    const deleteCardDetails = {
      libelle: this.card.Libelle,
      id: this.card.Id
    };
    this.apiService.makeRequest(apiUrl.deleteCarte, {id: deleteCardDetails.id}).toPromise()
      .then(res => {
        //this.getCartes(); EMMIT ? 
        this.deleteDialogRef.close();
        this.snackBar.open(deleteCardDetails.libelle + '" à bien été supprimé.', 'Fermer', {
          duration: 5000,
        });
      }, error => {
        this.snackBar.open('La carte n\'a pas pu être supprimée, veuillez réessayer.', 'Fermer', {
          duration: 5000,
        });
      });
  }

  cancelCardDelete() {
    this.deleteDialogRef.close();
  }

  cancelCardEdit() {
    this.editDialogRef.close();
  }

}

export interface Card {
  Id: number;
  Libelle: string;
  Portefeuille_Id: string;
  Creation: string;
  rattachement: string;
}
