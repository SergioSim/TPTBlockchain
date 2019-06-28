import { Component, OnInit } from '@angular/core';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';
import { CommonUtilsService } from 'src/app/common/common-utils.service';
import { Portefeuille } from '../clients-banque-prive/clients-banque-prive.component';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-portefeuille-banque-prive',
  templateUrl: './portefeuille-banque-prive.component.html',
  styleUrls: ['./portefeuille-banque-prive.component.css']
})
export class PortefeuilleBanquePriveComponent implements OnInit {

  public selectedPortefeuille: Portefeuille;
  private copyLibelle: string;
  faPen = faPen;
  public selectedSolde = 0;
  editDialogRef: any;

  constructor(
    public apiService: NodeapiService,
    public commonUtilsService: CommonUtilsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.selectedPortefeuille = this.apiService.portefeuilles[0];
    this.apiService.getRecord(this.selectedPortefeuille.ClePub).subscribe(data => {
      this.selectedSolde = data[0].balance;
    });
  }

  openEditWalletDialog(atemplate) {
    this.copyLibelle = this.selectedPortefeuille.Libelle;
    this.editDialogRef = this.dialog.open(atemplate, { width: '400px' });
  }

  confirmWalletEdit() {
    const editPortefeuilleDetails = {
      libelle: this.selectedPortefeuille.Libelle,
      id: this.selectedPortefeuille.Id
    };
    this.apiService.makeRequest(apiUrl.updatePortefeuilleLibelle, editPortefeuilleDetails).subscribe(
      res => {
        this.editDialogRef.close();
        this.snackBar.open(this.selectedPortefeuille.Libelle + ' à bien été mis à jour.', 'Fermer', {
          duration: 5000,
        });
        this.apiService.portefeuilles[0].Libelle = this.selectedPortefeuille.Libelle;
      }, error => {
        this.snackBar.open('Le portefeuille n\'a pas pu être mise à jour, veuillez réessayer.', 'Fermer', {
          duration: 5000,
        });
        this.selectedPortefeuille.Libelle = this.copyLibelle;
      });
  }

  cancelWalletEdit() {
    this.selectedPortefeuille.Libelle = this.copyLibelle;
    this.editDialogRef.close();
  }

}
