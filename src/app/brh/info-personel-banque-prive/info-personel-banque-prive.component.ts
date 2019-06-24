import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DialogData } from '../espace-utilisateur-banque-prive/espace-utilisateur-banque-prive.component';
import { FormControl, Validators } from '@angular/forms';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';

@Component({
  selector: 'app-info-personel-banque-prive',
  templateUrl: './info-personel-banque-prive.component.html',
  styleUrls: ['./info-personel-banque-prive.component.css']
})
export class InfoPersonelBanquePriveComponent implements OnInit {

  valueFC: FormControl = new FormControl('', [Validators.required]) ;

  constructor(
    public dialogRef: MatDialogRef<InfoPersonelBanquePriveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apiService: NodeapiService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  update() {
    // todo Cast codePostal!
    this.apiService.makeRequest(apiUrl.updateClient, {[this.data.name]: this.valueFC.value}).subscribe(
      data => {
        console.log(data);
        if (data.succes === true){
          this.apiService[this.data.name] = this.valueFC.value;
          console.log('apiservice nom=', this.apiService.nom);
          this.snackBar.open('Champs ' + this.data.name + ' est mis a jour avec succes!', 'Fermer', {
            duration: 5000,
            panelClass: ['succes-snackbar']
          });
          this.onNoClick();
        } else {
          this.snackBar.open('ERREUR! Champs ' + this.data.name + ' n\'est pas mis a jour!', 'Fermer', {
            duration: 5000,
            panelClass: ['alert-snackbar']
          });
        }
      }, error => {
        console.log('error', error);
        this.snackBar.open('ERREUR! Champs ' + this.data.name + ' n\'est pas mis a jour!', 'Fermer', {
          duration: 5000,
          panelClass: ['alert-snackbar']
        });
      }
    );
  }

}
