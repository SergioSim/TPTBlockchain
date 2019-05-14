import { Component, OnInit } from '@angular/core';
import { faCircle, faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-accueil-footer',
  templateUrl: './accueil-footer.component.html',
  styleUrls: ['./accueil-footer.component.css']
})
export class AccueilFooterComponent implements OnInit {
  faCircle = faCircle;
  constructor() { }

  ngOnInit() {
  }

}
