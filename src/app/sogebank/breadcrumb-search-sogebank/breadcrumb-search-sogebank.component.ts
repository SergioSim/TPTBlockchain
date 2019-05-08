import { Component, OnInit, Input } from '@angular/core';
import { IconDefinition, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumb-search-sogebank',
  templateUrl: './breadcrumb-search-sogebank.component.html',
  styleUrls: ['./breadcrumb-search-sogebank.component.css']
})
export class BreadcrumbSearchSogebankComponent implements OnInit {
  @Input() faIcon: IconDefinition;
  @Input() breadcrumbTitle: string;
  @Input() breadcrumbDetails: string;
  faSearch = faSearch;

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
  }

}


