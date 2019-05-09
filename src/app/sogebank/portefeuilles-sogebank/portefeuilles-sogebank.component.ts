import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-portefeuilles-sogebank',
  templateUrl: './portefeuilles-sogebank.component.html',
  styleUrls: ['./portefeuilles-sogebank.component.css']
})
export class PortefeuillesSogebankComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Mes portefeuilles - Sogebank');
  }

}


