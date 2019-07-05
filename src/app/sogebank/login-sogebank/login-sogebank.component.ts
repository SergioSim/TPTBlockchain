import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { FormControl, Validators } from '@angular/forms';
import { InputErrorStateMatcher } from './InputErrorStateMatcher';
import { Title } from '@angular/platform-browser';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login-sogebank',
  templateUrl: './login-sogebank.component.html',
  styleUrls: ['./login-sogebank.component.css']
})
export class LoginSogebankComponent implements OnInit {
  emailFC = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  prenomFC: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]) ;
  nomFC: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]) ;
  passwordFC: FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  passwordConfirmFC: FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  clientType = this.sogebankService.isNewParticulier === (true || null || undefined) ? 1 : 2;
  matcher = new InputErrorStateMatcher();
  dashboardUrl = '/sogebank/dashboard';

  displayLoginForm: boolean;

  constructor(
    private route: Router,
    public sogebankService: SogebankService,
    private apiService: NodeapiService,
    private titleService: Title,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Authentification - Sogebank');

    this.displayLoginForm = this.sogebankService.displayLoginForm;
  }

  onClientTypeChange(event) {
    this.clientType = event.value;
  }

  register() {
    if (this.emailFC.invalid || this.prenomFC.invalid || this.nomFC.invalid || this.passwordFC.invalid
        || this.passwordConfirmFC.invalid || this.clientType === null || this.clientType === undefined) {
      this.snackBar.open('Tous les champs sont requis!', 'Fermer', {
        duration: 5000,
        panelClass: ['alert-snackbar']
      });
      return;
    }
    if (this.passwordFC.value !== this.passwordConfirmFC.value) {
      this.snackBar.open('La confirmation du mot de passe doit être identique au mot de passe', 'Fermer', {
        duration: 5000,
        panelClass: ['alert-snackbar']
      });
      return;
    }
    this.apiService.register(this.emailFC.value, this.passwordFC.value, this.capitalizeName(this.prenomFC.value),
      this.capitalizeName(this.nomFC.value), 'Sogebank', this.clientType).subscribe(
        registerData => {
          if (registerData.success !== false) {
            this.apiService.login(this.emailFC.value, this.passwordFC.value, true).subscribe(
              loginData => {
                const newContactDetails = {
                  libelle: 'Sogebank',
                  email: 'contact@sogebank.ht'
                };
                this.apiService.makeRequest(apiUrl.createContactByUserEmail, newContactDetails).toPromise()
                  .then(res => {
                    this.route.navigate([this.dashboardUrl]);
                  }, error => {
                    console.log(error);
                  });
              },
              error => {
                console.log(error);
                this.snackBar.open('Votre compte à été créé, vous pouvez désormais vous connecter.', 'Fermer', {
                  duration: 5000,
                  panelClass: ['alert-snackbar']
                });
              });
          } else {
            this.snackBar.open('Ce compte existe déjà.', 'Fermer', {
              duration: 5000,
              panelClass: ['alert-snackbar']
            });
          }
        },
        error => {
          console.log(error);
          this.snackBar.open('La création du compte n\'a pas pu aboutir.', 'Fermer', {
            duration: 5000,
            panelClass: ['alert-snackbar']
          });
        }
      );
  }

  capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

}


