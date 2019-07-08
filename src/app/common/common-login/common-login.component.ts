import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NodeapiService } from 'src/app/nodeapi.service';
import { Router, Params } from '@angular/router';
import { AlertService } from 'src/app/brh/alert.service';
import { MatSnackBar } from '@angular/material';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-common-login',
  templateUrl: './common-login.component.html',
  styleUrls: ['./common-login.component.css']
})
export class CommonLoginComponent {
  @Input() url: string;
  @Input() banque: string;
  @Input() params: Params;
  emailFC: FormControl = new FormControl('', [Validators.required, Validators.email]) ;
  passwFC: FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  loading = false;
  resterConnecter = false;
  public host = environment.apiUrl + 'bienvenue';

  constructor(
    private route: Router,
    private apiService: NodeapiService,
    private alertService: AlertService,
    private snackBar: MatSnackBar
  ) {
    console.log('URL = ' + this.url);
   }

  login() {
    if (this.emailFC.invalid || this.passwFC.invalid) {
      this.snackBar.open('Les champs Email et Mot de passe sont requis!', 'Fermer', {
        duration: 5000,
        panelClass: ['alert-snackbar']
      });
      return;
    }
    this.loading = true;
    this.apiService.login(this.emailFC.value, this.passwFC.value, this.resterConnecter).subscribe(
      data => {
        console.log('URL = ' + this.url);
        if (!this.params) {
          this.route.navigate([this.url]);
        } else {
          this.route.navigate([this.url], { queryParams: this.params, queryParamsHandling: 'merge' });
        }
        this.loading = false;
      },
      error => {
        console.log(error);
        if (error.statusText === 'Unknown Error') {
          this.snackBar.open('Veuillez ajouter notre sertificat SSL en clickant sur "Autre problème de connexion ?"' +
          'ou verifiez votre connection Internet', 'Fermer', {
            duration: 5000,
            panelClass: ['alert-snackbar']
          });
        } else {
          if (error.errors && error.errors[0]) {
            this.snackBar.open(error.errors[0], 'Fermer', {
              duration: 5000,
              panelClass: ['alert-snackbar']
            });
          } else {
            this.snackBar.open('Email ou Mot de passe incorrecte.', 'Fermer', {
              duration: 5000,
              panelClass: ['alert-snackbar']
            });
          }
        }
        this.loading = false;
      });
  }

  toggle(event) {
    this.resterConnecter = event.checked;
  }
}
