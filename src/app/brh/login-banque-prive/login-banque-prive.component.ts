import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from '../alert.service';
import { NodeapiService } from 'src/app/nodeapi.service';

@Component({
  selector: 'app-login-banque-prive',
  templateUrl: './login-banque-prive.component.html',
  styleUrls: ['./login-banque-prive.component.css']
})
export class LoginBanquePriveComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: NodeapiService,
    private alertService: AlertService
  ){ }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = "brh/banque/prive/dashboard";
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      this.loading = true;
      this.apiService.login(this.f.email.value, this.f.password.value)
          .subscribe(
              data => {
                  this.router.navigate([this.returnUrl]);
              },
              error => {
                  console.log(error);
                  this.alertService.error(error.error.errors[0]);
                  this.loading = false;
              });
      }

}
