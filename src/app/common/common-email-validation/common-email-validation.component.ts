import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-common-email-validation',
  templateUrl: './common-email-validation.component.html',
  styleUrls: ['./common-email-validation.component.css']
})
export class CommonEmailValidationComponent implements OnInit, OnDestroy {

  public theUrl = 'validationEmail';
  public params: Params;
  private subscription: Subscription;

  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute,
    private apiService: NodeapiService,
    private snackBar: MatSnackBar) {
    }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.params = {token: params.token, random: Math.floor((Math.random() * 1000) + 1)};
    }).unsubscribe();
    this.subscription = this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.apiService.isConnected()) {
        if (!this.apiService.isEmailVerified) {
          this.apiService.makeRequest(apiUrl.validateEmail, {token: this.params.token}).subscribe(
            req => {
              if (req.success === true) {
                this.snackBar.open('Votre adresse email "' + this.apiService.email  + '" a ete valide avec succes!', 'Fermer', {
                  duration: 5000,
                  panelClass: ['succes-snackbar']
                });
                this.apiService.isEmailVerified = true;
                this.route.navigate(['portail']);
              }
            }, err => {
              console.log('err', err);
              let errorMessage = 'Erreur lie au token';
              if (typeof err.error.errors[0] === 'string') {
                errorMessage = err.error.errors;
              }
              this.snackBar.open(errorMessage, 'Fermer', {
                duration: 5000,
                panelClass: ['alert-snackbar']
              });
            }
          );
        } else {
          this.route.navigate(['portail']);
          this.snackBar.open('Votre adresse email "' + this.apiService.email  + '" a deja ete valide avec succes!', 'Fermer', {
            duration: 5000,
            panelClass: ['succes-snackbar']
          });
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
