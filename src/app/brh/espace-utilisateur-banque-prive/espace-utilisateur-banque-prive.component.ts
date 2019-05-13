import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NodeapiService } from 'src/app/nodeapi.service';


@Component({
  selector: 'app-espace-utilisateur-banque-prive',
  templateUrl: './espace-utilisateur-banque-prive.component.html',
  styleUrls: ['./espace-utilisateur-banque-prive.component.css']
})
export class EspaceUtilisateurBanquePriveComponent implements OnInit {

  constructor(
    private router: Router,
    private apiService: NodeapiService
  ) {
    if (!this.apiService.token) { 
      this.router.navigate(['/brh/banque/accueil']);
    }
   }

  ngOnInit() {
  }

}
