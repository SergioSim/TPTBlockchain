import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NodeapiService } from 'src/app/nodeapi.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/brh/alert.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-common-login',
  templateUrl: './common-login.component.html',
  styleUrls: ['./common-login.component.css']
})
export class CommonLoginComponent {
  @Input() url: string;
  @Input() banque: string;
  @Input() service: any;
  emailFC: FormControl = new FormControl('', [Validators.required, Validators.email]) ;
  passwFC: FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  loading = false;
  resterConnecter = false;

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
        if (this.service) {
          this.service.currentUserRole = data.permission;
          this.service.portefeuilles = data.portefeuilles;
          this.service.userEmail = data.email;
          this.service.userFullName = data.prenom + ' ' + data.nom;
          this.service.userAccessToken = data.accessToken;
          this.service.userRefreshToken = data.refreshToken;
        }
        console.log('URL = ' + this.url);
        this.route.navigate([this.url]);
        this.loading = false;
      },
      error => {
        console.log(error);
        this.snackBar.open('Email ou Mot de passe incorrecte.', 'Fermer', {
          duration: 5000,
          panelClass: ['alert-snackbar']
        });
        this.loading = false;
      });
  }

  toggle(event) {
    this.resterConnecter = event.checked;
  }
}
