import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-releves-sogebank',
  templateUrl: './releves-sogebank.component.html',
  styleUrls: ['./releves-sogebank.component.css']
})
export class RelevesSogebankComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Relevés - Sogebank');
  }

}


