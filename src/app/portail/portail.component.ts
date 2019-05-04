import { Component, OnInit, Renderer2 } from '@angular/core';
import { faCircle, faPlay } from '@fortawesome/free-solid-svg-icons';
import { PortailService } from './portail.service';

@Component({
  selector: 'app-portail',
  templateUrl: './portail.component.html',
  styleUrls: ['./portail.component.css']
})
export class PortailComponent implements OnInit {
  faCircle = faCircle;
  faPlay = faPlay;
  banks = [];
  brh = <any>{};

  constructor(
      private renderer: Renderer2,
      private portailService: PortailService
    ) {
    this.renderer.setStyle(document.body, 'height', '100%');
   }

  ngOnInit() {
    this.brh = this.portailService.getBRHDetails();
    this.banks = this.portailService.getBankDetails();
  }

}
