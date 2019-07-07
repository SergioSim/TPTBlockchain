import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DialogData } from '../espace-utilisateur-banque-prive/espace-utilisateur-banque-prive.component';
import { FormControl, Validators } from '@angular/forms';
import { NodeapiService, apiUrl, StatusClient } from 'src/app/nodeapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-personel-banque-prive',
  templateUrl: './info-personel-banque-prive.component.html',
  styleUrls: ['./info-personel-banque-prive.component.css']
})
export class InfoPersonelBanquePriveComponent implements OnInit {

  public valueFC: FormControl = new FormControl('', [Validators.required]) ;
  public passwordFC: FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  public passwordConfirmFC: FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  public showForClient = false;
  public showPassword = false;
  public showConfirm = false;
  public roles: string[] = ['Public', 'DemandeParticulier', 'DemandeCommercant', 'DemandeBanque', 'Particulier', 'Commercant'];
  public statuses: string[];

  constructor(
    public dialogRef: MatDialogRef<InfoPersonelBanquePriveComponent>,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private apiService: NodeapiService,
    private snackBar: MatSnackBar) {
      this.statuses = StatusClient;
      if (this.data.client) {
        console.log('client: ', this.data.client);
        this.showForClient = true;
      }
      if (this.data.name === 'Password') {
        this.showPassword = true;
      }
     }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  update() {
    this.apiService.makeRequest(
      this.data.client && this.data.clientChamp === 'Status' ? apiUrl.unBlockOrBlockClient :
      this.data.client && this.data.clientChamp === 'StatusClient' ? apiUrl.changeStatusClient : apiUrl.updateClient,
      this.data.client ? {bankEmail: this.data.client.Email, [this.data.name]: this.valueFC.value} :
      this.showPassword ? {oldPassword: this.valueFC.value, newPassword: this.passwordFC.value } :
      {[this.data.name]: this.valueFC.value}).subscribe(
      data => {
        console.log(data);
        if (data.succes === true) {
          if (this.data.client) {
            this.data.client[this.data.clientChamp] = this.valueFC.value;
            if (this.data.clientChamp === 'Status') {
              this.valueFC.value.substr(0, 7) === 'Demande' ?
                this.data.client.StatusClient = 'Bloqué' : this.data.client.StatusClient = 'Validé';
            }
            if (this.data.clientChamp === 'StatusClient' && this.valueFC.value === 'Validé') {
                this.data.client.LoginAttempts = 0;
            }
          } else if (this.showPassword) {
            this.apiService.logout();
            this.router.navigate(['/brh/accueil']);
          } else {
            this.apiService[this.data.name] = this.valueFC.value;
          }
          this.snackBar.open('Champs ' + this.data.name + ' est mis a jour avec succes!', 'Fermer', {
            duration: 5000,
            panelClass: ['succes-snackbar']
          });
          this.onNoClick();
        } else {
          this.showErrorMessage();
        }
      }, error => {
        this.showErrorMessage();
      }
    );
  }

  validate() {
    this.showConfirm = true;
  }

  showErrorMessage() {
    this.snackBar.open('ERREUR! Champs ' + this.data.name + ' n\'est pas mis a jour!', 'Fermer', {
      duration: 5000,
      panelClass: ['alert-snackbar']
    });
  }

}
