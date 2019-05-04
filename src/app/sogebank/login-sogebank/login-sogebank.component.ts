import { Component, OnInit } from '@angular/core';
import { faPlus, faUnlockAlt, faUser, faStoreAlt, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { FormControl, Validators } from '@angular/forms';
import { InputErrorStateMatcher } from './InputErrorStateMatcher';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login-sogebank',
  templateUrl: './login-sogebank.component.html',
  styleUrls: ['./login-sogebank.component.css']
})
export class LoginSogebankComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  matcher = new InputErrorStateMatcher();

  displayLoginForm: boolean;

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Authentification - Sogebank');

    this.displayLoginForm = this.sogebankService.displayLoginForm;
  }

}


