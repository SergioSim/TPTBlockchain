import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NodeapiService } from 'src/app/nodeapi.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/brh/alert.service';

@Component({
  selector: 'app-common-login',
  templateUrl: './common-login.component.html',
  styleUrls: ['./common-login.component.css']
})
export class CommonLoginComponent {
  @Input() url: string;
  emailFC: FormControl = new FormControl('', [Validators.required, Validators.email]) ;
  passwFC: FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]); 
  loading = false;

  constructor(    
    private route: Router,
    private apiService: NodeapiService,
    private alertService: AlertService
  ) {
    console.log("URL = " + this.url);
   }

  login() {
    if (this.emailFC.invalid || this.passwFC.invalid) {
      this.alertService.error("Les champs Email et Mot de passe sont requis!");
        return;
    }
    this.loading = true;
    this.apiService.login(this.emailFC.value, this.passwFC.value).subscribe(
      data => {
        console.log("URL = " + this.url);
          this.route.navigate([this.url]);
          this.loading = false;
      },
      error => {
          console.log(error);
          this.alertService.error("Email ou Mot de passe incorrecte");
          this.loading = false;
      });
  }
}
