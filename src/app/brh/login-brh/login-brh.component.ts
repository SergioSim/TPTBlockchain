import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login-brh',
  templateUrl: './login-brh.component.html',
  styleUrls: ['./login-brh.component.css']
})
export class LoginBrhComponent implements OnInit {
  

  displayLoginForm: boolean;

  constructor(
    private route: Router,
  ) { }

  ngOnInit() {

  }


  register() {
    this.route.navigate(['/brh/dashboard-brh']);
  }

}


