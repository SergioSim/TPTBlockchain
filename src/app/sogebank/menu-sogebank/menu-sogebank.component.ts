import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';

@Component({
  selector: 'app-menu-sogebank',
  templateUrl: './menu-sogebank.component.html',
  styleUrls: ['./menu-sogebank.component.css']
})
export class MenuSogebankComponent implements OnInit {
  userFullname: string;
  userAvatarUrl: string;
  
  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService
  ) { }

  ngOnInit() {
  }

}


