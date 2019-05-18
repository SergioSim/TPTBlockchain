import { Component, OnInit } from '@angular/core';
import { NodeapiService } from 'src/app/nodeapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-banque-prive',
  templateUrl: './login-banque-prive.component.html',
  styleUrls: ['./login-banque-prive.component.css']
})
export class LoginBanquePriveComponent implements OnInit {
  espaceUrl = 'brh/banque/prive/dashboard';

  constructor(
    private route: Router,
    private apiService: NodeapiService) { }

  ngOnInit() {
    if (this.apiService.isConnected()) {
      this.route.navigate([this.espaceUrl]);
    }
  }

}
