import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-sogebank',
  templateUrl: './dashboard-sogebank.component.html',
  styleUrls: ['./dashboard-sogebank.component.css']
})
export class DashboardSogebankComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Tableau de bord - Sogebank');
  }

}


