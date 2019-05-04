import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-accueil-brh',
  templateUrl: './accueil-brh.component.html',
  styleUrls: ['./accueil-brh.component.css']
})
export class AccueilBrhComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Accueil - Banque de la république d\'Haïti');
  }

}
