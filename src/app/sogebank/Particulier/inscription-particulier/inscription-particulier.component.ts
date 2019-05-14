import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { SogebankService } from '../sogebank.service';
import { FormControl, Validators } from '@angular/forms';
import { InputErrorStateMatcher } from './InputErrorStateMatcher';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-inscription-particulier',
  templateUrl: './inscription-particulier.component.html',
  styleUrls: ['./inscription-particulier.component.css']

})
export class InscriptionParticulierComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  matcher = new InputErrorStateMatcher();

  displayLoginForm: boolean;

  constructor(
    private route: Router,
   // private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Authentification - Sogebank');

    //this.displayLoginForm = this.sogebankService.displayLoginForm;
  }

  login() {
     this.route.navigate(['sogebank/Particulier/accueil']);
  }

  register() {
    this.route.navigate(['/sogebank/dashboard']);
  }

}


