import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-espace-utilisateur-sogebank',
  templateUrl: './espace-utilisateur-sogebank.component.html',
  styleUrls: ['./espace-utilisateur-sogebank.component.css']
})
export class EspaceUtilisateurSogebankComponent implements OnInit {

  constructor(
    private router: Router,
    private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Tableau de bord - Sogebank');
    console.log(this.router.url);
  }

}


