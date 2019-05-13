import { Component, OnInit, Renderer2 } from '@angular/core';
import { faCircle, faPlay } from '@fortawesome/free-solid-svg-icons';
import { PortailService } from './portail.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-portail',
  templateUrl: './portail.component.html',
  styleUrls: ['./portail.component.css']
})
export class PortailComponent implements OnInit {
  faPlay = faPlay;
  banks = [];
  brh = <any>{};

  constructor(
      private renderer: Renderer2,
      private portailService: PortailService,
      private titleService: Title
    ) {
    this.renderer.setStyle(document.body, 'height', '100%');
   }

  ngOnInit() {
    this.titleService.setTitle('Portail DHTG - Banque de la république d\'Haïti');

    this.brh = this.portailService.getBRHDetails();
    this.banks = this.portailService.getBankDetails();
  }

}
