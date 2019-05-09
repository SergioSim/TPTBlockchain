import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-virements-sogebank',
  templateUrl: './virements-sogebank.component.html',
  styleUrls: ['./virements-sogebank.component.css']
})
export class VirementsSogebankComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Virements - Sogebank');
  }

}


